// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/data/ml-models/fraud_detection/train.py
================================================================================

"""
train.py

This script handles the training of a fraud detection model.

It performs the following steps:
1.  Loads configuration from a YAML file.
2.  Loads the raw transaction data.
3.  Defines a preprocessing pipeline for numeric and categorical features.
4.  Splits the data into training and testing sets.
5.  Defines a model training pipeline that includes:
    - The preprocessing steps.
    - SMOTE for handling class imbalance.
    - An XGBoost classifier.
6.  Trains the model on the training data.
7.  Evaluates the model's performance on the test set.
8.  Saves the trained model pipeline and evaluation metrics to disk.

Usage:
    python data/ml-models/fraud_detection/train.py \
        --data-path /path/to/your/processed_data.csv \
        --config-path /path/to/your/training_config.yaml \
        --output-dir /path/to/your/model_artifacts/
"""

import argparse
import logging
import os
import sys
import yaml
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
)
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
import xgboost as xgb
import joblib

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)


def load_config(config_path: str) -> dict:
    """
    Loads the training configuration from a YAML file.

    Args:
        config_path (str): Path to the YAML configuration file.

    Returns:
        dict: A dictionary containing the configuration.
    """
    try:
        with open(config_path, "r") as f:
            config = yaml.safe_load(f)
        logger.info(f"Configuration loaded successfully from {config_path}")
        return config
    except FileNotFoundError:
        logger.error(f"Configuration file not found at {config_path}")
        sys.exit(1)
    except yaml.YAMLError as e:
        logger.error(f"Error parsing YAML file: {e}")
        sys.exit(1)


def load_data(data_path: str) -> pd.DataFrame:
    """
    Loads data from a CSV file.

    Args:
        data_path (str): Path to the CSV data file.

    Returns:
        pd.DataFrame: The loaded data as a pandas DataFrame.
    """
    if not os.path.exists(data_path):
        logger.error(f"Data file not found at {data_path}")
        sys.exit(1)
    try:
        df = pd.read_csv(data_path)
        logger.info(f"Data loaded successfully from {data_path}. Shape: {df.shape}")
        return df
    except Exception as e:
        logger.error(f"Error loading data from {data_path}: {e}")
        sys.exit(1)


def create_preprocessor(numeric_features: list, categorical_features: list) -> ColumnTransformer:
    """
    Creates a scikit-learn ColumnTransformer for preprocessing data.

    Args:
        numeric_features (list): List of names of numeric columns.
        categorical_features (list): List of names of categorical columns.

    Returns:
        ColumnTransformer: A scikit-learn ColumnTransformer object.
    """
    numeric_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown="ignore")

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, categorical_features),
        ],
        remainder="passthrough",
    )
    logger.info("Preprocessor created for numeric and categorical features.")
    return preprocessor


def evaluate_model(y_true: np.ndarray, y_pred: np.ndarray, y_pred_proba: np.ndarray) -> dict:
    """
    Evaluates the model and returns a dictionary of metrics.

    Args:
        y_true (np.ndarray): True labels.
        y_pred (np.ndarray): Predicted labels.
        y_pred_proba (np.ndarray): Predicted probabilities for the positive class.

    Returns:
        dict: A dictionary containing evaluation metrics.
    """
    try:
        metrics = {
            "accuracy": accuracy_score(y_true, y_pred),
            "precision": precision_score(y_true, y_pred),
            "recall": recall_score(y_true, y_pred),
            "f1_score": f1_score(y_true, y_pred),
            "roc_auc": roc_auc_score(y_true, y_pred_proba),
        }
        logger.info("Model Evaluation Metrics:")
        for key, value in metrics.items():
            logger.info(f"  {key.capitalize()}: {value:.4f}")

        logger.info("\nClassification Report:")
        report = classification_report(y_true, y_pred)
        logger.info(f"\n{report}")

        logger.info("\nConfusion Matrix:")
        cm = confusion_matrix(y_true, y_pred)
        logger.info(f"\n{cm}")

        return metrics
    except Exception as e:
        logger.error(f"An error occurred during model evaluation: {e}")
        return {}


def save_artifacts(pipeline: ImbPipeline, output_dir: str, metrics: dict):
    """
    Saves the trained model pipeline and evaluation metrics.

    Args:
        pipeline (ImbPipeline): The trained model pipeline.
        output_dir (str): The directory to save artifacts to.
        metrics (dict): A dictionary of evaluation metrics.
    """
    try:
        os.makedirs(output_dir, exist_ok=True)

        # Save model pipeline
        model_path = os.path.join(output_dir, "fraud_detection_pipeline.joblib")
        joblib.dump(pipeline, model_path)
        logger.info(f"Model pipeline saved to {model_path}")

        # Save metrics
        metrics_path = os.path.join(output_dir, "evaluation_metrics.json")
        with open(metrics_path, "w") as f:
            json.dump(metrics, f, indent=4)
        logger.info(f"Evaluation metrics saved to {metrics_path}")

    except Exception as e:
        logger.error(f"Error saving artifacts: {e}")
        sys.exit(1)


def main(args):
    """
    Main function to orchestrate the model training workflow.
    """
    # Load configuration
    config = load_config(args.config_path)
    features_config = config.get("features", {})
    model_params = config.get("model_params", {})
    training_params = config.get("training_params", {})

    target_column = features_config.get("target_column")
    numeric_features = features_config.get("numeric_features", [])
    categorical_features = features_config.get("categorical_features", [])

    if not all([target_column, numeric_features]):
        logger.error("Configuration file must specify target_column and numeric_features.")
        sys.exit(1)

    # Load data
    df = load_data(args.data_path)

    # Define features (X) and target (y)
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # Verify all specified features are in the dataframe
    all_features = numeric_features + categorical_features
    missing_features = [f for f in all_features if f not in X.columns]
    if missing_features:
        logger.error(f"The following features specified in config are not in the data: {missing_features}")
        sys.exit(1)
    
    X = X[all_features]

    # Split data
    test_size = training_params.get("test_size", 0.2)
    random_state = training_params.get("random_state", 42)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    logger.info(f"Data split into training and testing sets. Train shape: {X_train.shape}, Test shape: {X_test.shape}")
    logger.info(f"Fraud cases in training set: {y_train.sum()} ({y_train.mean()*100:.2f}%)")
    logger.info(f"Fraud cases in test set: {y_test.sum()} ({y_test.mean()*100:.2f}%)")


    # Create preprocessing and model pipeline
    preprocessor = create_preprocessor(numeric_features, categorical_features)

    # Define the model
    classifier = xgb.XGBClassifier(**model_params, use_label_encoder=False, eval_metric='logloss')

    # Define SMOTE
    smote = SMOTE(random_state=random_state)

    # Create the full imblearn pipeline
    # This pipeline correctly applies SMOTE only to the training data during `fit`
    model_pipeline = ImbPipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("smote", smote),
            ("classifier", classifier),
        ]
    )
    logger.info("Model training pipeline created with preprocessor, SMOTE, and XGBClassifier.")

    # Train the model
    logger.info("Starting model training...")
    model_pipeline.fit(X_train, y_train)
    logger.info("Model training completed.")

    # Evaluate the model
    logger.info("Evaluating model on the test set...")
    y_pred = model_pipeline.predict(X_test)
    y_pred_proba = model_pipeline.predict_proba(X_test)[:, 1]
    metrics = evaluate_model(y_test, y_pred, y_pred_proba)

    # Save artifacts
    logger.info(f"Saving model artifacts to {args.output_dir}...")
    save_artifacts(model_pipeline, args.output_dir, metrics)
    logger.info("Training script finished successfully.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fraud Detection Model Training Script")
    parser.add_argument(
        "--data-path",
        type=str,
        required=True,
        help="Path to the processed training data CSV file.",
    )
    parser.add_argument(
        "--config-path",
        type=str,
        required=True,
        help="Path to the training configuration YAML file.",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        required=True,
        help="Directory to save the trained model and other artifacts.",
    )

    args = parser.parse_args()
    main(args)

# Example `training_config.yaml` file:
#
# features:
#   target_column: "is_fraud"
#   numeric_features:
#     - "amount"
#     - "old_balance_org"
#     - "new_balance_org"
#     - "old_balance_dest"
#     - "new_balance_dest"
#     - "hour_of_day"
#   categorical_features:
#     - "type"
#     - "day_of_week"
#
# training_params:
#   test_size: 0.2
#   random_state: 42
#
# model_params:
#   objective: "binary:logistic"
#   n_estimators: 200
#   max_depth: 5
#   learning_rate: 0.1
#   subsample: 0.8
#   colsample_bytree: 0.8
#   gamma: 0.1
#   random_state: 42
#   n_jobs: -1
#   # scale_pos_weight can be an alternative to SMOTE for XGBoost
#   # but we are using SMOTE in the pipeline for a more general approach
#   # scale_pos_weight: 10
#
# To run this script:
# python data/ml-models/fraud_detection/train.py \
#   --data-path path/to/your/data.csv \
#   --config-path path/to/your/training_config.yaml \
#   --output-dir path/to/save/artifacts/
#