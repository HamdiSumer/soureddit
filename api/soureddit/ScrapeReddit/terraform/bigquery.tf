# Enable BigQuery service
resource "google_project_service" "bigquery_service" {
  project = google_project.soureddit.project_id
  service = "bigquery.googleapis.com"
}

# Create the BigQuery datasets
resource "google_bigquery_dataset" "stg_bq_dataset" {
  depends_on = [
    google_project.soureddit,
    google_project_service.bigquery_service
  ]

  project    = google_project.soureddit.project_id
  location   = var.region
  dataset_id = var.stg_bq_dataset
  friendly_name = "Staging Dataset"
  default_table_expiration_ms = 3600000
  default_partition_expiration_ms = 3600000
  delete_contents_on_destroy = true
}

resource "google_bigquery_dataset" "prod_bq_dataset" {
  depends_on = [
    google_project.soureddit,
    google_project_service.bigquery_service
  ]

  project    = google_project.soureddit.project_id
  location   = var.region
  dataset_id = var.prod_bq_dataset
  friendly_name = "Production Dataset"
  default_table_expiration_ms = 3600000
  default_partition_expiration_ms = 3600000
  delete_contents_on_destroy = true
}