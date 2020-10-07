resource "aws_sqs_queue" "bucket_put_ev_queue" {
  name = var.sqs_bucket_put_ev_queue
  fifo_queue = false
  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "arn:aws:sqs:*:*:${var.sqs_bucket_put_ev_queue}",
      "Condition": {
        "ArnEquals": { "aws:SourceArn": "${aws_s3_bucket.source_bucket.arn}" }
      }
    }
  ]
}
POLICY
}
