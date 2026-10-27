<?php
declare(strict_types=1);
require dirname(__DIR__) . '/public/api/invoice-email.php';

$email = invoice_email([
    'preview' => true,
    'number' => 'MUSTER-2026-001',
    'date' => '27.10.2026',
    'deliveryDate' => 'Beispiel: 29.10.2026',
    'customerName' => 'Anna Beispiel',
    'customerAddress' => "Musterstraße 12\n12345 Musterstadt\nDeutschland",
    'seller' => "Medeina · Çağla Mutlu\n[Firmenanschrift ergänzen]\n[Steuernummer oder USt-ID ergänzen]",
    'items' => [
        ['title' => 'Lotus-Kerzenhalter · Beispielartikel', 'quantity' => 1, 'unitCents' => 2490],
        ['title' => 'Bergkristall · Beispielartikel', 'quantity' => 1, 'unitCents' => 1800],
    ],
    'shippingCents' => 490,
    'totalCents' => 4780,
    'netCents' => 4017,
    'taxCents' => 763,
    'taxRate' => 19,
    'taxNote' => 'Alle Artikelpreise und Versandkosten inklusive Mehrwertsteuer. MUSTER: 19 % dienen nur als Beispiel; die tatsächliche steuerliche Behandlung ist noch zu bestätigen.',
    'paymentMethod' => 'PayPal · Testzahlung',
]);
$directory = dirname(__DIR__) . '/previews';
$logo = base64_encode(file_get_contents(dirname(__DIR__) . '/public/images/mainlogo.png'));
file_put_contents($directory . '/invoice-email.html', str_replace('cid:medeina-logo', 'data:image/png;base64,' . $logo, $email['html']));
file_put_contents($directory . '/invoice-email.txt', $email['subject'] . "\n\n" . $email['text']);
$boundary = 'medeina-invoice-preview';
$related = 'medeina-invoice-related';
$eml = "From: Medeina <store@example.com>\r\nTo: Anna Beispiel <anna@example.com>\r\nSubject: =?UTF-8?B?" . base64_encode($email['subject']) . "?=\r\nMIME-Version: 1.0\r\nContent-Type: multipart/related; boundary=\"{$related}\"\r\n\r\n--{$related}\r\nContent-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n\r\n";
foreach (['text' => 'text/plain', 'html' => 'text/html'] as $part => $type) {
    $eml .= "--{$boundary}\r\nContent-Type: {$type}; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($email[$part]), 76, "\r\n");
}
$eml .= "--{$boundary}--\r\n";
$eml .= "--{$related}\r\nContent-Type: image/png\r\nContent-ID: <medeina-logo>\r\nContent-Disposition: inline; filename=\"mainlogo.png\"\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split($logo, 76, "\r\n") . "--{$related}--\r\n";
file_put_contents($directory . '/invoice-email.eml', $eml);
echo "Rechnungsvorschau erstellt (HTML, Text und EML). Keine E-Mail versendet.\n";
