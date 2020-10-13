resource "aws_vpc" "Wordpress_vpc" {
  cidr_block           = var.vpcCIDRblock
  instance_tenancy     = var.instanceTenancy
  enable_dns_support   = var.dnsSupport
  enable_dns_hostnames = var.dnsHostNames
}

# Internet Gateway
resource "aws_internet_gateway" "wordpress_igw" {
  vpc_id = aws_vpc.Wordpress_vpc.id
}

resource "aws_route_table" "wordpress_rt" {
  vpc_id = aws_vpc.Wordpress_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.wordpress_igw.id
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "public" {
  count = length(var.subnets_cidr)
  vpc_id = aws_vpc.Wordpress_vpc.id
  cidr_block = element(var.subnets_cidr,count.index)
  availability_zone = element(data.aws_availability_zones.available.names,count.index)
  map_public_ip_on_launch = true
}

resource "aws_route_table_association" "a" {
  count = 2
  subnet_id      = element(aws_subnet.public.*.id,count.index)
  route_table_id = aws_route_table.wordpress_rt.id
}