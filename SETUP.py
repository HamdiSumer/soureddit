import subprocess

def main():
    subprocess.run(["docker", "build", "-t", "extending_airflow", "airflow"])
    subprocess.run(["docker-compose", "--env-file", "../.env", "up", "-d"], cwd='./airflow')

    subprocess.run(["docker", "exec", "airflow-webserver", "airflow", "variables", "import",
                    "airflow_credentials.json"], shell=True)

    subprocess.run(["docker-compose", "up", "-d"])


if __name__ == "__main__":
    main()
