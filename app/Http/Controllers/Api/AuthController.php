<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\PasswordReset;

class AuthController extends Controller
{
    //Đăng ký người dùng
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'username' => $request->username,
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'role'     => 'user', // mặc định
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng ký thành công!',
            'user' => $user,
            'token' => $token,
        ], 201);
    }
    //Đăng nhập người dùng 
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
            throw ValidationException::withMessages([
                'username' => ['Thông tin đăng nhập không chính xác'],
            ]);
        }

        // Xóa token cũ nếu có
        $user->tokens()->delete();

        // Tạo token mới
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công!',
            'user' => $user,
            'token' => $token,
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

    // Đăng xuất: thu hồi token hiện tại
    public function logout(Request $request)
    {
        // Nếu dùng Sanctum token-based, revoke only current access token
        $user = $request->user();
        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Đăng xuất thành công.'
        ]);
    }

    // Đổi mật khẩu cho user đang đăng nhập
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!$user || !Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Mật khẩu hiện tại không chính xác.'
            ], 422);
        }

        // Cập nhật mật khẩu mới
        $user->password = Hash::make($request->password);
        $user->setRememberToken(Str::random(60));
        $user->save();

        // Thu hồi token cũ và phát hành token mới để đảm bảo an toàn
        $user->tokens()->delete();
        $newToken = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'message' => 'Đổi mật khẩu thành công.',
            'token' => $newToken,
        ]);
    }
}
