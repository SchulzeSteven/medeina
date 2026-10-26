<?php
declare(strict_types=1);

function inquiry_email(array $inquiry): array
{
    $turkish = $inquiry['language'] === 'tr';
    $copy = $turkish
        ? [
            'Yeni bir talep var.',
            'Ad',
            'E-posta',
            'İlgi alanı',
            'Mesaj',
            'Mesaj eklenmedi.',
            'Bu e-postayı yanıtlayarak talepte bulunan kişiye ulaşabilirsin.',
        ]
        : [
            'Eine neue Anfrage ist da.',
            'Name',
            'E-Mail',
            'Interesse',
            'Nachricht',
            'Keine Nachricht angegeben.',
            'Du kannst direkt auf diese E-Mail antworten, um die anfragende Person zu erreichen.',
        ];
    $escape = static fn(string $value): string => htmlspecialchars(
        $value,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8',
    );
    $rows = '';
    $text = $copy[0] . "\n\n";

    foreach (['name', 'email', 'interest', 'message'] as $index => $field) {
        $value = $inquiry[$field] ?: $copy[5];
        $label = $copy[$index + 1];
        $rows .=
            '<tr><td style="padding:12px 0;color:#795b3d;font-size:16px"><strong style="font-weight:700">' .
            $escape($label) .
            '</strong><br><span style="color:#283d3e;white-space:pre-wrap;overflow-wrap:anywhere">' .
            $escape($value) .
            '</span></td></tr>';
        $text .= $label . ': ' . $value . "\n\n";
    }

    $language = $turkish ? 'tr' : 'de';
    $heading = $escape($copy[0]);
    $footer = $escape($copy[6]);
    $html = <<<HTML
    <!doctype html>
    <html lang="{$language}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="margin: 0; background: #faf7f2; color: #283d3e">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding: 24px 16px">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                style="
                  max-width: 600px;
                  font-family: Arial, Helvetica, sans-serif;
                  font-size: 16px;
                  line-height: 1.7;
                "
              >
                <tr>
                  <td style="
                    padding: 32px;
                    background: #285e65;
                    color: #faf7f2;
                    border-radius: 16px 16px 0 0;
                  ">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="100" valign="middle">
                          <img
                            src="cid:medeina-logo"
                            alt="Medeina Logo"
                            width="100"
                            height="110"
                            style="display: block; width: 100px; height: auto; margin: 0; border: 0"
                          >
                        </td>
                        <td valign="middle" style="padding-left: 16px">
                          <p style="margin: 0; color: #e7c579; font-family: Georgia, serif; font-size: 30px; line-height: 1.2">
                            Medeina
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px; background: #fffdf9">
                    <h1 style="
                      margin: 0 0 24px;
                      font-family: Georgia, serif;
                      font-size: 30px;
                      font-weight: normal;
                      line-height: 1.3;
                    ">{$heading}</h1>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      {$rows}
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="
                    padding: 24px 32px;
                    background: #eae1d4;
                    border-radius: 0 0 16px 16px;
                    font-size: 16px;
                  ">
                    <p style="margin: 0">{$footer}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    HTML;

    return ['html' => $html, 'text' => $text . $copy[6]];
}
