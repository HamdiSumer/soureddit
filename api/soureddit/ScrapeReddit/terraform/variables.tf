variable "project_id" {
  description = "GCP Project Id"
  type        = string
}

variable "region" {
  description = "Your project region"
  default     = "europe-west9"
  type        = string
}

variable "zone" {
  description = "Your project zone"
  default     = "europe-west9-a"
  type        = string
}

variable "bucket" {
  description = "Bucket name should be unique across GCP"
  type        = string
}

variable "scrape_bucket" {
  description = "Bucket name should be unique across GCP"
  type        = string
}

variable "stg_bq_dataset" {
  description = "Staging dataset"
  type        = string
}

variable "prod_bq_dataset" {
  description = "Production dataset"
  type        = string
}
