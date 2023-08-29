"""This script runs whole application with .env and airflow-credential.json file provided"""
import subprocess


def main():
    # Build airflow image
    subprocess.run(["docker", "build", "-t", "extending_airflow:latest", "-f", "airflow/Dockerfile", "."])
    # Run airflow docker compose with env file attached
    subprocess.run(["docker-compose", "--env-file", "../.env", "up", "-d"], cwd='./airflow')
    # Import airflow variables
    subprocess.run(["docker", "exec", "airflow-webserver", "airflow", "variables", "import",
                    "airflow_credentials.json"], shell=True)
    # Build django image
    subprocess.run(["docker", "build", "api"])
    # Run docker compose
    subprocess.run(["docker-compose", "up", "-d"])


if __name__ == "__main__":
    main()
