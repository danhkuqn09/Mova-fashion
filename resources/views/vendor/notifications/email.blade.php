<x-mail::message>
{{-- Mova Fashion Custom Email Layout --}}
<div style="text-align:center; margin-bottom:24px;">
    <img src="#" alt="Mova Fashion Logo" style="height:60px; margin-bottom:8px;">
    <h2 style="color:#e91e63; font-family:sans-serif; margin:0;">Mova Fashion</h2>
</div>

{{-- Greeting --}}
@if (! empty($greeting))
# {{ $greeting }}
@else
@if ($level === 'error')
# Oops! Có lỗi xảy ra
@else
# Xin chào quý khách!
@endif
@endif

{{-- Intro Lines --}}
@foreach ($introLines as $line)
{{ $line }}
@endforeach

{{-- Action Button --}}
@isset($actionText)
<?php
    $color = match ($level) {
        'success', 'error' => $level,
        default => 'primary',
    };
?>
<x-mail::button :url="$actionUrl" :color="$color" style="background:#e91e63; border-radius:6px; font-weight:bold;">
{{ $actionText }}
</x-mail::button>
@endisset

{{-- Outro Lines --}}
@foreach ($outroLines as $line)
{{ $line }}
@endforeach

{{-- Salutation --}}
@if (! empty($salutation))
{{ $salutation }}
@else
Trân trọng,<br>
<b style="color:#e91e63;">Mova Fashion</b>
@endif

{{-- Subcopy --}}
@isset($actionText)
<x-slot:subcopy>
Nếu bạn gặp khó khăn khi nhấn nút <b>{{ $actionText }}</b>, hãy sao chép và dán đường dẫn dưới đây vào trình duyệt của bạn:<br>
<span style="word-break:break-all; color:#e91e63;">{{ $displayableActionUrl }}</span>
</x-slot:subcopy>
@endisset

<hr style="margin:32px 0 8px 0; border:none; border-top:1px solid #eee;">
<div style="text-align:center; color:#888; font-size:13px;">
    Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của <b>Mova Fashion</b>.<br>
    Mọi thắc mắc xin liên hệ: <a href="mailto:danhntps36798@fpt.edu.vn" style="color:#e91e63;">danhntps36798@fpt.edu.vn</a>
</div>
</x-mail::message>
