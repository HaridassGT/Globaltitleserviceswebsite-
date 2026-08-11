<?php
/* ============================================================
   GLOBAL TITLE SERVICES — contact.php
   Hostinger PHP Mail Handler for contact@globaltitleservices.in
   ============================================================ */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$fullName = isset($_POST['full_name']) ? trim(strip_tags($_POST['full_name'])) : '';
$company  = isset($_POST['company']) ? trim(strip_tags($_POST['company'])) : '';
$email    = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : '';
$phone    = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$service  = isset($_POST['service']) ? trim(strip_tags($_POST['service'])) : '';
$message  = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

if (!$fullName || !$email) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Full Name and Email Address are required.']);
    exit;
}

$to = 'contact@globaltitleservices.in';
$subject = 'New Website Inquiry from ' . $fullName;

$emailBody  = "====================================================\n";
$emailBody .= "NEW CONTACT INQUIRY — GLOBAL TITLE SERVICES\n";
$emailBody .= "====================================================\n\n";
$emailBody .= "Full Name:            " . $fullName . "\n";
$emailBody .= "Company Name:         " . ($company ?: 'N/A') . "\n";
$emailBody .= "Email Address:        " . $email . "\n";
$emailBody .= "Phone Number:         " . ($phone ?: 'N/A') . "\n";
$emailBody .= "Service Interested:   " . ($service ?: 'General Inquiry') . "\n\n";
$emailBody .= "Message Content:\n";
$emailBody .= "----------------------------------------------------\n";
$emailBody .= ($message ?: 'No message text provided.') . "\n";
$emailBody .= "----------------------------------------------------\n\n";
$emailBody .= "Timestamp: " . date('Y-m-d H:i:s T') . "\n";
$emailBody .= "Sender IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

$headers   = array();
$headers[] = 'From: Global Title Services Website <contact@globaltitleservices.in>';
$headers[] = 'Reply-To: ' . $fullName . ' <' . $email . '>';
$headers[] = 'Cc: info@globaltitleservices.in, Sales@globaltitleservices.in';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$sent = @mail($to, $subject, $emailBody, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['status' => 'success', 'message' => 'Thank you! Your inquiry has been sent to contact@globaltitleservices.in.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Mail delivery failed on server.']);
}
