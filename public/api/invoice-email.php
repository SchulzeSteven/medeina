<?php
declare(strict_types=1);

/** Presentation only: pass immutable, server-verified invoice data, never checkout input. */
function invoice_email(array $invoice): array
{
    $escape = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $money = static fn(int $cents): string => number_format($cents / 100, 2, ',', '.') . ' €';
    $preview = !empty($invoice['preview']);
    $number = $escape($invoice['number']);
    $date = $escape($invoice['date']);
    $name = $escape($invoice['customerName']);
    $address = nl2br($escape($invoice['customerAddress']));
    $seller = nl2br($escape($invoice['seller']));
    $taxNote = $escape($invoice['taxNote']);
    $total = $escape($money($invoice['totalCents']));
    $payment = $escape($invoice['paymentMethod']);
    $deliveryDate = $escape($invoice['deliveryDate']);
    $subject = ($preview ? '[TEST · MUSTER] ' : '') . 'Deine Rechnung ' . $invoice['number'] . ' · Medeina';
    $rows = '';
    $text = ($preview ? "TESTMAIL · MUSTERDATEN · KEINE GÜLTIGE RECHNUNG\n\n" : '') . "Medeina by Çağla Mutlu\nVielen Dank für deinen Einkauf, {$invoice['customerName']}!\n\nRechnung {$invoice['number']}\nRechnungsdatum: {$invoice['date']}\nLieferdatum: {$invoice['deliveryDate']}\n\nRechnung an:\n{$invoice['customerName']}\n{$invoice['customerAddress']}\n\n";
    foreach ($invoice['items'] as $item) {
        $title = $escape($item['title']);
        $quantity = (int) $item['quantity'];
        $unit = $escape($money($item['unitCents']));
        $line = $escape($money($item['unitCents'] * $quantity));
        $rows .= "<tr><td style=\"padding:18px 24px 18px 0;border-bottom:1px solid #dbd6ca\">{$title}<br><span style=\"font-size:14px;color:#5a6864\">{$quantity} Stück · je {$unit}</span></td><td align=\"right\" style=\"padding:18px 0;border-bottom:1px solid #dbd6ca;white-space:nowrap\">{$line}</td></tr>";
        $text .= "{$item['title']} · {$quantity} Stück · je " . $money($item['unitCents']) . ' · ' . $money($item['unitCents'] * $quantity) . "\n";
    }
    $shipping = $escape($money($invoice['shippingCents']));
    $taxRows = '';
    $taxText = '';
    if (isset($invoice['netCents'], $invoice['taxCents'], $invoice['taxRate'])) {
        if ($invoice['netCents'] + $invoice['taxCents'] !== $invoice['totalCents']) {
            throw new InvalidArgumentException('Net amount and VAT must equal the gross total.');
        }
        $net = $escape($money($invoice['netCents']));
        $tax = $escape($money($invoice['taxCents']));
        $rate = $escape((string) $invoice['taxRate']);
        $taxRows = "<tr><td style=\"padding:8px 0\">Nettobetrag</td><td align=\"right\">{$net}</td></tr><tr><td style=\"padding:8px 0\">Mehrwertsteuer ({$rate} %)</td><td align=\"right\">{$tax}</td></tr>";
        $taxText = "Nettobetrag: " . $money($invoice['netCents']) . "\nMehrwertsteuer ({$invoice['taxRate']} %): " . $money($invoice['taxCents']) . "\n";
    }
    $html = <<<HTML
    <!doctype html>
    <html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{$number} · Medeina</title></head>
    <body style="margin:0;background:#faf7f2;color:#283d3e">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:1440px;font:16px/1.7 Arial,Helvetica,sans-serif">
          <tr><td style="padding:32px;background:#173d42;color:#faf7f2">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td width="80" valign="middle"><img src="cid:medeina-logo" alt="" width="80" style="display:block;width:80px;height:auto;border:0"></td>
              <td valign="middle" style="padding-left:16px"><p style="margin:0;font:28px Georgia,serif;letter-spacing:2px;color:#e7c579">MEDEINA</p>
              <p style="margin:6px 0 0;font:16px Georgia,serif;color:#faf7f2">by Çağla Mutlu</p></td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:32px;background:#fffdf9">
            <p style="margin:0 0 12px;color:#795b3d;font-size:13px;letter-spacing:2px">DEIN EINKAUF BEI MEDEINA</p>
            <h1 style="margin:0 0 20px;font:34px/1.2 Georgia,serif;color:#173d42">Ein kleines Stück<br>Wohlbefinden für dich.</h1>
            <p style="margin:0 0 28px">Hallo {$name},<br>vielen Dank für deinen Einkauf und dein Vertrauen. Hier findest du deine Rechnung zu deiner Bestellung.</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2"><tr><td style="padding:20px">
              <strong style="color:#285e65">Rechnung {$number}</strong><br>
              Rechnungsdatum: {$date}<br>Lieferdatum: {$deliveryDate}<br>
              <span style="color:#285e65">Bezahlt mit {$payment}</span>
            </td></tr></table>
            <p style="margin:24px 0 4px;color:#795b3d;font-size:14px">RECHNUNG AN</p>
            <p style="margin:0 0 24px">{$name}<br>{$address}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;font:16px/1.6 Arial,Helvetica,sans-serif;color:#283d3e">
              <tr><th align="left" style="border-bottom:2px solid #285e65;padding:8px 24px 8px 0">Artikel</th><th align="right" style="border-bottom:2px solid #285e65;padding:8px 0">Betrag</th></tr>
              {$rows}
              <tr><td style="padding:16px 0">Versand</td><td align="right">{$shipping}</td></tr>
              {$taxRows}
              <tr><td style="padding:16px 0;border-top:1px solid #dbd6ca;font-weight:bold">Gesamtbetrag</td><td align="right" style="padding:16px 0;border-top:1px solid #dbd6ca;font-size:24px;color:#173d42;white-space:nowrap">{$total}</td></tr>
            </table>
            <p style="margin:0 0 28px;font-size:14px;color:#5a6864">{$taxNote}</p>
            <p style="margin:0">Ich wünsche dir viel Freude mit deiner Auswahl.<br><span style="font:25px Georgia,serif;color:#285e65">Deine Çağla</span></p>
          </td></tr>
          <tr><td style="padding:24px 32px;background:#eae1d4;border-radius:0 0 16px 16px">
            <p style="margin:0 0 12px">Fragen zu deiner Bestellung? Antworte einfach auf diese E-Mail.</p>
            <p style="margin:0;font-size:13px;color:#5a6864">{$seller}</p>
          </td></tr>
        </table>
      </td></tr></table>
    </body></html>
    HTML;
    $text .= "Versand: " . $money($invoice['shippingCents']) . "\n" . $taxText . "Gesamtbetrag: " . $money($invoice['totalCents']) . "\n{$invoice['taxNote']}\nBezahlt mit {$invoice['paymentMethod']}\n\n{$invoice['seller']}\n\nFragen? Antworte einfach auf diese E-Mail.\nDeine Çağla";
    return ['subject' => $subject, 'html' => $html, 'text' => $text];
}
