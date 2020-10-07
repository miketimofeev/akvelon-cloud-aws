resource "aws_s3_bucket" "source_bucket" {
  bucket = var.s3_source_bucket
  acl    = "public-read"
  force_destroy = true
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.source_bucket.id

  queue {
    queue_arn     = aws_sqs_queue.bucket_put_ev_queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_suffix = ".jpg"
  }
}

resource "aws_s3_bucket" "target_bucket" {
  bucket = var.s3_target_bucket
  acl    = "public-read"
  force_destroy = true
}
