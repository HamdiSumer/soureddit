resource "google_storage_bucket" "bucket" {
  name          = var.bucket
  location      = var.region
  force_destroy = true

  uniform_bucket_level_access = true

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age = 90 # days
    }
  }
}

resource "google_storage_bucket" "scrape_bucket" {
  name          = var.scrape_bucket
  location      = var.region
  force_destroy = true

  uniform_bucket_level_access = true

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age = 90 # days
    }
  }
}