// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/data/pipelines/dags/transaction_etl.py
================================================================================

"""
# Apache Airflow DAG for Transaction ETL

This DAG defines the complete ETL (Extract, Transform, Load) pipeline for processing
transaction data. It's designed to be modular, extensible, and integrated with
various cloud services and third-party APIs to maximize data value, aligning with
the project's goal of becoming a central value-added platform.

### Pipeline Overview:

1.  **Extract**: Fetches raw transaction data from primary sources (e.g., Plaid, Stripe APIs).
2.  **Stage**: Loads the raw, unprocessed data into a data lake (GCS) and then into a
    staging table in the data warehouse (BigQuery) for idempotency and auditability.
3.  **Enrich (Parallel Tasks)**:
    *   **Merchant Enrichment**: Cleans merchant names and adds details like logos, addresses,
      and industry codes using a dedicated service or internal mapping.
    *   **Categorization**: Applies a machine learning model (e.g., hosted on Vertex AI)
      to classify transactions into standardized categories.
    *   **Geolocation**: Enriches transactions with location data (city, state, country)
      if latitude/longitude are present.
    *   **Fraud Detection**: Runs a fraud scoring model or rule engine to flag
      suspicious transactions.
    *   **User Profile Enrichment**: Joins with user data from a CRM or user database
      to add customer context.
4.  **Transform**: Combines the raw data with all enrichment streams into a final,
    denormalized, analytics-ready table.
5.  **Load**: Atomically loads the transformed data into the final production table in
    the data warehouse using a MERGE operation to handle updates and new records.
6.  **Data Quality**: Performs a series of checks on the final table to ensure data
    integrity, accuracy, and completeness.
7.  **Cleanup**: Removes temporary data from the staging area.

### Integrations:

*   **Cloud Provider**: Google Cloud Platform (GCP)
    *   **Data Lake**: Google Cloud Storage (GCS)
    *   **Data Warehouse**: Google BigQuery
    *   **ML/AI**: Google Vertex AI (for categorization/fraud models)
*   **Data Source**: Plaid (or similar financial data aggregator)
*   **Authentication**: Assumes Airflow Connections are configured for GCP (`google_cloud_default`)
  and other services (e.g., `plaid_api`).
"""

import json
import pendulum
import pandas as pd
from io import StringIO

from airflow.decorators import dag, task, task_group
from airflow.models import Variable
from airflow.operators.empty import EmptyOperator
from airflow.providers.google.cloud.transfers.gcs_to_bigquery import GCSToBigQueryOperator
from airflow.providers.google.cloud.operators.bigquery import (
    BigQueryInsertJobOperator,
    BigQueryCheckOperator,
)
from airflow.providers.google.cloud.hooks.gcs import GCSHook
from airflow.exceptions import AirflowFailException

# --- Configuration Variables ---
# Set these in the Airflow UI -> Admin -> Variables
GCP_PROJECT_ID = Variable.get("gcp_project_id", "your-gcp-project-id")
GCP_GCS_BUCKET = Variable.get("gcp_gcs_bucket_name", "your-data-lake-bucket")
GCP_CONN_ID = "google_cloud_default"
BQ_DATASET = Variable.get("bq_dataset", "transaction_processing")
BQ_STAGING_TABLE = "stg_transactions_raw"
BQ_ENRICHED_TABLE = "enriched_transactions"
BQ_FINAL_TABLE = "fact_transactions"

# --- Default DAG Arguments ---
default_args = {
    "owner": "AI_Programmer",
    "depends_on_past": False,
    "start_date": pendulum.datetime(2023, 1, 1, tz="UTC"),
    "email_on_failure": False,
    "email_on_retry": False,
    "retries": 2,
    "retry_delay": pendulum.duration(minutes=5),
    "gcp_conn_id": GCP_CONN_ID,
}

@dag(
    dag_id="transaction_etl_pipeline",
    default_args=default_args,
    schedule_interval="0 4 * * *",  # Run daily at 4:00 AM UTC
    catchup=False,
    tags=["transactions", "etl", "production", "gcp"],
    doc_md=__doc__,
    description="ETL pipeline for enriching and processing transaction data.",
)
def transaction_etl_pipeline():
    """
    ### Transaction ETL Pipeline

    This DAG orchestrates the process of fetching, enriching, and storing
    transaction data into a BigQuery data warehouse.
    """

    start = EmptyOperator(task_id="start_pipeline")
    end = EmptyOperator(task_id="end_pipeline")

    @task(task_id="extract_transactions_from_source")
    def extract_transactions(**context) -> str:
        """
        Extracts raw transaction data from a source API like Plaid.
        In a real scenario, this would involve API calls, pagination, and error handling.
        Here, we simulate the process by generating sample data.
        The output is the GCS path to the raw data file.
        """
        import uuid
        from faker import Faker

        fake = Faker()
        logical_date = context["ds"]
        print(f"Extracting transactions for date: {logical_date}")

        # --- Placeholder for Plaid API Client ---
        # from services.plaid_client import PlaidClient
        # client = PlaidClient(api_key=Variable.get("plaid_api_key", deserialize_json=True))
        # raw_transactions = client.get_transactions(start_date=logical_date, end_date=logical_date)
        # -----------------------------------------

        # Simulate raw data
        data = []
        for _ in range(1000):
            data.append({
                "transaction_id": str(uuid.uuid4()),
                "user_id": f"user_{fake.random_int(min=1, max=100)}",
                "amount": round(fake.random_number(digits=4, fix_len=True) / 100.0, 2),
                "iso_currency_code": fake.currency_code(),
                "description_raw": fake.company(),
                "transaction_date": logical_date,
                "pending": fake.boolean(chance_of_getting_true=10),
                "location": {
                    "lat": float(fake.latitude()),
                    "lon": float(fake.longitude()),
                },
                "payment_channel": fake.random_element(elements=("online", "in store", "other")),
                "extracted_at": pendulum.now("UTC").isoformat(),
            })

        df = pd.DataFrame(data)
        # Convert nested JSON to string for BigQuery loading
        df['location'] = df['location'].apply(json.dumps)
        
        # Upload to GCS
        gcs_hook = GCSHook(gcp_conn_id=GCP_CONN_ID)
        file_name = f"transactions/raw/{logical_date}/transactions_{context['run_id']}.csv"
        
        with StringIO() as csv_buffer:
            df.to_csv(csv_buffer, index=False)
            gcs_hook.upload(
                bucket_name=GCP_GCS_BUCKET,
                object_name=file_name,
                data=csv_buffer.getvalue(),
                mime_type="text/csv",
            )
        
        print(f"Successfully extracted {len(df)} transactions to gs://{GCP_GCS_BUCKET}/{file_name}")
        return f"gs://{GCP_GCS_BUCKET}/{file_name}"

    load_raw_to_staging_bq = GCSToBigQueryOperator(
        task_id="load_raw_to_staging_bq",
        bucket=GCP_GCS_BUCKET,
        source_objects="{{ task_instance.xcom_pull(task_ids='extract_transactions_from_source', key='return_value').split('/')[-4:] | join('/') }}",
        destination_project_dataset_table=f"{GCP_PROJECT_ID}.{BQ_DATASET}.{BQ_STAGING_TABLE}${{{{ ds_nodash }}}}",
        schema_fields=[
            {"name": "transaction_id", "type": "STRING", "mode": "REQUIRED"},
            {"name": "user_id", "type": "STRING", "mode": "NULLABLE"},
            {"name": "amount", "type": "FLOAT", "mode": "NULLABLE"},
            {"name": "iso_currency_code", "type": "STRING", "mode": "NULLABLE"},
            {"name": "description_raw", "type": "STRING", "mode": "NULLABLE"},
            {"name": "transaction_date", "type": "DATE", "mode": "NULLABLE"},
            {"name": "pending", "type": "BOOLEAN", "mode": "NULLABLE"},
            {"name": "location", "type": "STRING", "mode": "NULLABLE"}, # Loaded as JSON string
            {"name": "payment_channel", "type": "STRING", "mode": "NULLABLE"},
            {"name": "extracted_at", "type": "TIMESTAMP", "mode": "NULLABLE"},
        ],
        write_disposition="WRITE_TRUNCATE", # Partitioned table, so we truncate the partition for the day
        create_disposition="CREATE_IF_NEEDED",
        source_format="CSV",
        skip_leading_rows=1,
        time_partitioning={"type": "DAY", "field": "transaction_date"},
        cluster_fields=["user_id"],
    )

    @task_group(group_id="enrichment_tasks")
    def enrichment_group():
        """
        A group of parallel tasks to enrich the raw transaction data.
        Each task reads from the staging table, performs enrichment, and writes
        to a new column or a separate enrichment table.
        For simplicity, these tasks will be implemented as BigQuery SQL jobs.
        """

        # In a real-world scenario, these could be Python tasks calling external APIs
        # or ML models, then loading results back to BigQuery.
        # Example:
        # @task
        # def enrich_merchant_data_api():
        #   ... call Google Places API ...
        #   ... load results to a BQ table ...

        enrich_merchant_data = BigQueryInsertJobOperator(
            task_id="enrich_merchant_data",
            configuration={
                "query": {
                    "query": f"sql/enrich_merchant.sql",
                    "useLegacySql": False,
                    "queryParameters": [
                        {
                            "name": "project_id",
                            "parameterType": {"type": "STRING"},
                            "parameterValue": {"value": GCP_PROJECT_ID},
                        },
                        {
                            "name": "dataset",
                            "parameterType": {"type": "STRING"},
                            "parameterValue": {"value": BQ_DATASET},
                        },
                        {
                            "name": "staging_table",
                            "parameterType": {"type": "STRING"},
                            "parameterValue": {"value": f"{BQ_STAGING_TABLE}${{{{ ds_nodash }}}}"},
                        },
                    ],
                }
            },
            gcp_conn_id=GCP_CONN_ID,
            location="US", # Specify BQ location
        )

        enrich_categorization_ml = BigQueryInsertJobOperator(
            task_id="enrich_categorization_ml",
            configuration={
                "query": {
                    "query": f"sql/enrich_categorization.sql",
                    "useLegacySql": False,
                    "queryParameters": [
                        {
                            "name": "project_id",
                            "parameterType": {"type": "STRING"},
                            "parameterValue": {"value": GCP_PROJECT_ID},
                        },
                        {
                            "name": "dataset",
                            "parameterType": {"type": "STRING"},
                            "parameterValue": {"value": BQ_DATASET},
                        },
                        {
                            "name": "staging_table",
                            "parameterType": {"type": "STRING"},
                            "parameterValue": {"value": f"{BQ_STAGING_TABLE}${{{{ ds_nodash }}}}"},
                        },
                        # This would point to a Vertex AI model endpoint
                        {
                            "name": "ml_model_endpoint",
                            "parameterType": {"type": "STRING"},
                            "parameterValue": {"value": "projects/your-gcp-project-id/locations/us-central1/models/your_tx_category_model"},
                        },
                    ],
                }
            },
            gcp_conn_id=GCP_CONN_ID,
            location="US",
        )

        run_fraud_detection = BigQueryInsertJobOperator(
            task_id="run_fraud_detection",
            configuration={
                "query": {
                    "query": f"sql/enrich_fraud_score.sql",
                    "useLegacySql": False,
                    "queryParameters": [
                        {
                            "name": "project_id",
                            "parameterType": {"type": "STRING"},
                            "parameterValue": {"value": GCP_PROJECT_ID},
                        },
                        {
                            "name": "dataset",
                            "parameterType": {"type": "STRING"},
                            "parameterValue": {"value": BQ_DATASET},
                        },
                        {
                            "name": "staging_table",
                            "parameterType": {"type": "STRING"},
                            "parameterValue": {"value": f"{BQ_STAGING_TABLE}${{{{ ds_nodash }}}}"},
                        },
                    ],
                }
            },
            gcp_conn_id=GCP_CONN_ID,
            location="US",
        )

    transform_and_load_to_final_table = BigQueryInsertJobOperator(
        task_id="transform_and_load_to_final_table",
        configuration={
            "query": {
                "query": f"sql/transform_and_load_final.sql",
                "useLegacySql": False,
                "destinationTable": {
                    "projectId": GCP_PROJECT_ID,
                    "datasetId": BQ_DATASET,
                    "tableId": BQ_FINAL_TABLE,
                },
                "writeDisposition": "WRITE_APPEND", # We use MERGE inside the SQL
                "createDisposition": "CREATE_IF_NEEDED",
                "timePartitioning": {"type": "DAY", "field": "transaction_date"},
                "clustering": {"fields": ["user_id", "merchant_name", "category"]},
                "queryParameters": [
                    {
                        "name": "project_id",
                        "parameterType": {"type": "STRING"},
                        "parameterValue": {"value": GCP_PROJECT_ID},
                    },
                    {
                        "name": "dataset",
                        "parameterType": {"type": "STRING"},
                        "parameterValue": {"value": BQ_DATASET},
                    },
                    {
                        "name": "staging_table",
                        "parameterType": {"type": "STRING"},
                        "parameterValue": {"value": f"{BQ_STAGING_TABLE}${{{{ ds_nodash }}}}"},
                    },
                    {
                        "name": "target_date",
                        "parameterType": {"type": "DATE"},
                        "parameterValue": {"value": "{{ ds }}"},
                    },
                ],
            }
        },
        gcp_conn_id=GCP_CONN_ID,
        location="US",
    )

    @task_group(group_id="data_quality_checks")
    def data_quality_group():
        """
        Group of tasks to verify the integrity of the final loaded data.
        """
        # Checks that the primary key is unique for the processed date.
        check_uniqueness = BigQueryCheckOperator(
            task_id="check_uniqueness_in_final_table",
            sql=f"""
            SELECT COUNT(1)
            FROM (
                SELECT transaction_id, COUNT(1) AS occurrences
                FROM `{GCP_PROJECT_ID}.{BQ_DATASET}.{BQ_FINAL_TABLE}`
                WHERE transaction_date = '{{{{ ds }}}}'
                GROUP BY 1
                HAVING occurrences > 1
            )
            """,
            use_legacy_sql=False,
            location="US",
        )

        # Checks that there are no NULL amounts.
        check_nulls = BigQueryCheckOperator(
            task_id="check_nulls_in_final_table",
            sql=f"""
            SELECT COUNT(1)
            FROM `{GCP_PROJECT_ID}.{BQ_DATASET}.{BQ_FINAL_TABLE}`
            WHERE transaction_date = '{{{{ ds }}}}'
            AND (amount IS NULL OR transaction_id IS NULL OR user_id IS NULL)
            """,
            use_legacy_sql=False,
            location="US",
        )

        # Checks that the row count for the day is within an expected range.
        check_row_count = BigQueryCheckOperator(
            task_id="check_row_count_in_final_table",
            sql=f"""
            SELECT COUNT(*)
            FROM `{GCP_PROJECT_ID}.{BQ_DATASET}.{BQ_FINAL_TABLE}`
            WHERE transaction_date = '{{{{ ds }}}}'
            """,
            use_legacy_sql=False,
            location="US",
            # This is a simple example. A more robust check might compare against a historical average.
            # The operator will fail if the result is not between min_threshold and max_threshold.
            # Here, we just check if it's greater than 0.
            pass_value=0,
            tolerance=1.0, # Check if result > pass_value
        )

    @task(task_id="cleanup_staging_table", trigger_rule="all_done")
    def cleanup_staging_table(**context):
        """
        Deletes the daily partition from the staging table after the pipeline succeeds or fails.
        """
        from google.cloud import bigquery
        from google.api_core.exceptions import NotFound

        logical_date_nodash = context["ds_nodash"]
        table_id = f"{GCP_PROJECT_ID}.{BQ_DATASET}.{BQ_STAGING_TABLE}${logical_date_nodash}"
        
        print(f"Attempting to clean up staging partition: {table_id}")
        
        try:
            client = bigquery.Client()
            client.delete_table(table_id)
            print(f"Successfully deleted staging partition: {table_id}")
        except NotFound:
            print(f"Staging partition {table_id} not found. Skipping cleanup.")
        except Exception as e:
            print(f"An error occurred during cleanup: {e}")
            # We don't want cleanup failure to fail the whole DAG run
            # raise AirflowFailException(f"Failed to clean up staging table: {e}")


    # Define Task Dependencies
    extracted_data_gcs_path = extract_transactions()

    start >> extracted_data_gcs_path >> load_raw_to_staging_bq

    load_raw_to_staging_bq >> enrichment_group() >> transform_and_load_to_final_table

    transform_and_load_to_final_table >> data_quality_group() >> cleanup_staging_table() >> end

# Instantiate the DAG
transaction_etl_dag = transaction_etl_pipeline()