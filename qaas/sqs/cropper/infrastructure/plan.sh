terraform plan -var="vpc_id=vpc-e816318f" \
  -var="ec2_keypair_name=wordpress_key_pair" \
  -var="s3_source_bucket=akvelon_demo_1602013928848_source" \
  -var="s3_target_bucket=akvelon_demo_1602013928848_target" \
  -var="sqs_bucket_put_ev_queue=akvelon_demo_1602013928848_bucket_put_image_ev"

