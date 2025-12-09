<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\EmailVerification;
use App\Notifications\SendOtpNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\Events\PasswordReset;
use Carbon\Carbon;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    /**
     * Đăng ký người dùng với xác thực OTP qua email
     */
    public function __construct()
    {
        // Middleware có thể được thêm ở đây nếu cần
    }
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
        ], [
            'username.required' => 'Username là bắt buộc',
            'username.unique' => 'Username đã tồn tại',
            'email.required' => 'Email là bắt buộc',
            'email.unique' => 'Email đã được sử dụng',
            'password.required' => 'Mật khẩu là bắt buộc',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Tạo user nhưng chưa verify email
        $user = User::create([
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'user',
        ]);

        // Tạo OTP (6 số ngẫu nhiên)
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Lưu OTP vào database
        EmailVerification::create([
            'email' => $user->email,
            'otp' => $otp,
            'expires_at' => Carbon::now()->addMinutes(10), // OTP hết hạn sau 10 phút
            'verified' => false,
        ]);

        // Gửi email OTP
        try {
            Notification::route('mail', $user->email)->notify(new SendOtpNotification($otp));
        } catch (\Exception $e) {
            Log::error('Send OTP failed: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.',
            'data' => [
                'email' => $user->email,
                'expires_in' => '10 phút'
            ]
        ], 201);
    }

    /**
     * Xác thực OTP sau khi đăng ký
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Tìm OTP
        $verification = EmailVerification::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('verified', false)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$verification) {
            return response()->json([
                'success' => false,
                'message' => 'Mã OTP không đúng hoặc không tồn tại'
            ], 400);
        }

        // Kiểm tra OTP đã hết hạn chưa
        if ($verification->expires_at->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.'
            ], 400);
        }

        // Đánh dấu OTP đã xác thực
        $verification->markAsVerified();

        // Cập nhật email_verified_at cho user
        $user = User::where('email', $request->email)->first();
        $user->email_verified_at = now();
        $user->save();

        // Tạo token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Xác thực email thành công!',
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 200);
    }

    /**
     * Gửi lại OTP nếu hết hạn
     */
    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        // Kiểm tra user đã verify chưa
        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email đã được xác thực rồi'
            ], 400);
        }

        // Tạo OTP mới
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Xóa OTP cũ chưa verify
        EmailVerification::where('email', $user->email)
            ->where('verified', false)
            ->delete();

        // Tạo OTP mới
        EmailVerification::create([
            'email' => $user->email,
            'otp' => $otp,
            'expires_at' => Carbon::now()->addMinutes(10),
            'verified' => false,
        ]);

        // Gửi email OTP
        try {
            Notification::route('mail', $user->email)->notify(new SendOtpNotification($otp));
        } catch (\Exception $e) {
            Log::error('Resend OTP failed: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã gửi lại mã OTP. Vui lòng kiểm tra email.',
            'data' => [
                'expires_in' => '10 phút'
            ]
        ], 200);
    }
    /**
     * Đăng nhập người dùng
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)
            ->orWhere('email', $request->username)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Thông tin đăng nhập không chính xác'
            ], 401);
        }

        // Kiểm tra email đã verify chưa
        if (!$user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng xác thực email trước khi đăng nhập',
                'data' => [
                    'email' => $user->email,
                    'require_verification' => true
                ]
            ], 403);
        }

        // Xóa token cũ nếu có
        $user->tokens()->delete();

        // Tạo token mới
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công!',
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 200);
    }


    // Gửi link reset password
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'message' => 'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'
                ]);
            }
            
            return response()->json([
                'message' => 'Gửi email thất bại. Vui lòng thử lại.',
                'error' => 'send_failed'
            ], 500);
            
        } catch (\Symfony\Component\Mailer\Exception\TransportExceptionInterface $e) {
            // Lỗi gửi mail (SMTP/transport) - không áp dụng bất kỳ giới hạn nào
            return response()->json([
                'message' => 'Không thể gửi email. Vui lòng thử lại sau.',
                'error' => 'mail_send_failed'
            ], 500);
        } catch (\Exception $e) {
            // Catch any other unexpected errors
            return response()->json([
                'message' => 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.',
                'error' => 'unexpected_error'
            ], 500);
        }
    }

    // Đặt lại mật khẩu
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Đặt lại mật khẩu thành công.'])
            : response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 400);
    }

    /**
     * Chuyển hướng đến Google OAuth
     */
    public function redirectToGoogle()
    {
        try {
            $url = Socialite::driver('google')
                ->stateless()
                ->redirect()
                ->getTargetUrl();
            
            return response()->json([
                'success' => true,
                'url' => $url
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể kết nối đến Google. Vui lòng thử lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xử lý callback từ Google OAuth
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            // Lấy thông tin user từ Google
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            // Tìm user theo google_id hoặc email
            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if ($user) {
                // User đã tồn tại, cập nhật google_id và avatar nếu chưa có
                if (!$user->google_id) {
                    $user->google_id = $googleUser->getId();
                }
                if (!$user->avatar && $googleUser->getAvatar()) {
                    $user->avatar = $googleUser->getAvatar();
                }
                // Đánh dấu email đã verify
                if (!$user->email_verified_at) {
                    $user->email_verified_at = now();
                }
                $user->save();
            } else {
                // Tạo user mới
                $username = explode('@', $googleUser->getEmail())[0];
                $originalUsername = $username;
                $counter = 1;
                
                // Đảm bảo username unique
                while (User::where('username', $username)->exists()) {
                    $username = $originalUsername . $counter;
                    $counter++;
                }

                $user = User::create([
                    'username' => $username,
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => now(), // Google đã verify email rồi
                    'password' => Hash::make(Str::random(32)), // Random password
                    'role' => 'user',
                ]);
            }

            // Xóa token cũ
            $user->tokens()->delete();

            // Tạo token mới
            $token = $user->createToken('google_auth_token')->plainTextToken;

            // Redirect về frontend với token và user info
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            $userData = urlencode(json_encode([
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'role' => $user->role,
            ]));
            
            return redirect()->away(
                "{$frontendUrl}/auth/google/callback?token={$token}&user={$userData}"
            );

        } catch (\Exception $e) {
            Log::error('Google OAuth failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Đăng nhập Google thất bại. Vui lòng thử lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
