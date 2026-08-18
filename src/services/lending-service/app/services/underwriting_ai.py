// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/lending-service/app/services/underwriting_ai.py
================================================================================

import logging
import numpy as np
from typing import Dict, Any, Optional, Tuple

# Configure logging for the underwriting AI service
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class UnderwritingAI:
    """
    The core AI model for loan underwriting. It assesses credit risk based on
    financial data to make approval decisions and determine interest rates.

    This class simulates a sophisticated AI model. In a production environment,
    `_predict_risk` and `_calculate_interest_rate` would integrate with
    actual machine learning models (e.g., scikit-learn, TensorFlow, PyTorch)
    trained on vast datasets. The `_preprocess_data` method would also likely
    involve more complex feature engineering pipelines.
    """

    def __init__(self,
                 risk_threshold_high: float = 0.6,
                 risk_threshold_medium: float = 0.4,
                 base_interest_rate: float = 0.03, # 3%
                 risk_premium_factor: float = 0.05, # 5% per unit of risk score
                 min_credit_score: int = 600,
                 max_debt_to_income: float = 0.45,
                 min_income_to_loan_ratio: float = 0.2, # Minimum annual income should be 20% of loan amount
                 model_path: Optional[str] = None):
        """
        Initializes the UnderwritingAI with configuration parameters.

        Args:
            risk_threshold_high (float): Risk score above which a loan is likely denied.
            risk_threshold_medium (float): Risk score above which a higher interest rate applies.
            base_interest_rate (float): The lowest possible interest rate for low-risk applicants.
            risk_premium_factor (float): Factor to adjust interest rate based on risk score.
            min_credit_score (int): Minimum acceptable credit score for approval.
            max_debt_to_income (float): Maximum acceptable debt-to-income ratio.
            min_income_to_loan_ratio (float): Minimum ratio of annual income to requested loan amount.
            model_path (Optional[str]): Path to a pre-trained ML model (e.g., a .pkl file).
                                        Currently, this is a placeholder.
        """
        self.risk_threshold_high = risk_threshold_high
        self.risk_threshold_medium = risk_threshold_medium
        self.base_interest_rate = base_interest_rate
        self.risk_premium_factor = risk_premium_factor
        self.min_credit_score = min_credit_score
        self.max_debt_to_income = max_debt_to_income
        self.min_income_to_loan_ratio = min_income_to_loan_ratio

        self.model = self._load_model(model_path)
        logger.info("UnderwritingAI initialized with configured parameters.")

    def _load_model(self, model_path: Optional[str]):
        """
        Loads a pre-trained machine learning model.
        In a real scenario, this would load a model from disk (e.g., using pickle, joblib, or a framework's loader).
        For this simulation, we return a mock model.
        """
        if model_path:
            logger.warning(f"Attempted to load model from {model_path}. "
                           "This is a placeholder; a real model loading mechanism would be implemented here.")
            # Example:
            # try:
            #     import joblib
            #     model = joblib.load(model_path)
            #     logger.info(f"Successfully loaded model from {model_path}")
            #     return model
            # except Exception as e:
            #     logger.error(f"Failed to load model from {model_path}: {e}")
            #     logger.warning("Using mock model for risk prediction.")
            #     return self._mock_ml_model
        
        logger.info("Using mock ML model for risk prediction and interest rate calculation.")
        return self._mock_ml_model

    def _mock_ml_model(self, features: Dict[str, Any]) -> Tuple[float, float]:
        """
        A mock machine learning model that simulates risk prediction and
        interest rate calculation based on simplified rules.

        In a real system, this would be replaced by an actual trained model.
        It returns a tuple: (risk_score, base_rate_adjustment).
        """
        credit_score = features.get('credit_score', 0)
        debt_to_income_ratio = features.get('debt_to_income_ratio', 0.5)
        employment_stability_score = features.get('employment_stability_score', 0.5) # 0 to 1, 1 being very stable
        income_stability_score = features.get('income_stability_score', 0.5) # 0 to 1, 1 being very stable
        loan_to_income_ratio = features.get('loan_to_income_ratio', 1.0) # loan_amount / annual_income

        # Simulate risk score (higher is riskier)
        # Inverse relationship with credit score, direct with DTI, inverse with stability
        risk_score = (1 - (credit_score / 850)) * 0.4 + \
                     debt_to_income_ratio * 0.3 + \
                     (1 - employment_stability_score) * 0.15 + \
                     (1 - income_stability_score) * 0.1 + \
                     (loan_to_income_ratio / 5.0) * 0.05 # Max 5x income loan

        risk_score = np.clip(risk_score, 0.01, 0.99) # Ensure score is between 0 and 1

        # Simulate base rate adjustment (higher for higher risk)
        # This could be a separate model or part of the same.
        # For simplicity, let's make it proportional to risk score.
        base_rate_adjustment = risk_score * self.risk_premium_factor * 2 # Scale it up for impact

        return float(risk_score), float(base_rate_adjustment)

    def _preprocess_data(self, financial_data: Dict[str, Any], loan_request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Preprocesses raw financial data and loan request into features suitable for the AI model.
        This includes feature engineering, handling missing values, and normalization.

        Args:
            financial_data (Dict[str, Any]): Raw financial information of the applicant.
                                              Expected keys: 'annual_income', 'monthly_debt_payments',
                                              'credit_score', 'employment_status', 'employment_duration_months',
                                              'assets_value', 'liabilities_value', 'bank_account_balance', etc.
            loan_request (Dict[str, Any]): Details of the requested loan.
                                            Expected keys: 'loan_amount', 'loan_term_months', 'loan_purpose'.

        Returns:
            Dict[str, Any]: A dictionary of engineered features.
        """
        logger.debug("Starting data preprocessing.")
        processed_features = {}

        # Basic data extraction and default handling
        annual_income = financial_data.get('annual_income', 0.0)
        monthly_debt_payments = financial_data.get('monthly_debt_payments', 0.0)
        credit_score = financial_data.get('credit_score', 0)
        employment_duration_months = financial_data.get('employment_duration_months', 0)
        loan_amount = loan_request.get('loan_amount', 0.0)
        loan_term_months = loan_request.get('loan_term_months', 1) # Avoid division by zero

        # Feature Engineering
        # Debt-to-Income Ratio (DTI)
        if annual_income > 0:
            processed_features['debt_to_income_ratio'] = (monthly_debt_payments * 12) / annual_income
        else:
            processed_features['debt_to_income_ratio'] = 1.0 # Max DTI if no income

        # Credit Score
        processed_features['credit_score'] = credit_score

        # Employment Stability Score (simple heuristic)
        # More sophisticated models would use employment history, industry, etc.
        if employment_duration_months >= 60: # 5 years
            processed_features['employment_stability_score'] = 1.0
        elif employment_duration_months >= 24: # 2 years
            processed_features['employment_stability_score'] = 0.8
        elif employment_duration_months >= 6: # 6 months
            processed_features['employment_stability_score'] = 0.5
        else:
            processed_features['employment_stability_score'] = 0.2

        # Income Stability Score (placeholder, could come from bank statements analysis)
        # For now, assume it's high if employment is stable and income is present.
        processed_features['income_stability_score'] = processed_features['employment_stability_score'] * (1 if annual_income > 0 else 0.1)

        # Loan-to-Income Ratio
        if annual_income > 0:
            processed_features['loan_to_income_ratio'] = loan_amount / annual_income
        else:
            processed_features['loan_to_income_ratio'] = float('inf') # Very high if no income

        # Add other relevant features directly
        processed_features['loan_amount'] = loan_amount
        processed_features['loan_term_months'] = loan_term_months
        processed_features['annual_income'] = annual_income

        logger.debug(f"Preprocessing complete. Features: {processed_features}")
        return processed_features

    def _predict_risk(self, features: Dict[str, Any]) -> float:
        """
        Predicts the credit risk score using the loaded (or mock) ML model.
        A higher score indicates higher risk.

        Args:
            features (Dict[str, Any]): Engineered features from the applicant's data.

        Returns:
            float: A risk score, typically between 0 and 1.
        """
        logger.debug(f"Predicting risk for features: {features}")
        risk_score, _ = self.model(features) # Call the mock model
        logger.info(f"Predicted risk score: {risk_score:.4f}")
        return risk_score

    def _determine_decision(self,
                            risk_score: float,
                            features: Dict[str, Any]) -> Tuple[str, list]:
        """
        Determines the loan approval decision based on the risk score and business rules.

        Args:
            risk_score (float): The predicted credit risk score.
            features (Dict[str, Any]): Engineered features used for decision making.

        Returns:
            Tuple[str, list]: A tuple containing the decision ('APPROVED', 'DENIED')
                              and a list of reasons for the decision.
        """
        decision = "APPROVED"
        reasons = []

        # Rule 1: High Risk Score
        if risk_score >= self.risk_threshold_high:
            decision = "DENIED"
            reasons.append(f"High credit risk score ({risk_score:.2f} >= {self.risk_threshold_high:.2f}).")

        # Rule 2: Minimum Credit Score
        if features.get('credit_score', 0) < self.min_credit_score:
            decision = "DENIED"
            reasons.append(f"Credit score ({features['credit_score']}) is below minimum required ({self.min_credit_score}).")

        # Rule 3: Debt-to-Income Ratio
        if features.get('debt_to_income_ratio', 0) > self.max_debt_to_income:
            decision = "DENIED"
            reasons.append(f"Debt-to-income ratio ({features['debt_to_income_ratio']:.2f}) exceeds maximum allowed ({self.max_debt_to_income:.2f}).")

        # Rule 4: Income to Loan Ratio
        if features.get('annual_income', 0) > 0 and features.get('loan_amount', 0) > 0:
            if features['loan_amount'] / features['annual_income'] > (1 / self.min_income_to_loan_ratio):
                decision = "DENIED"
                reasons.append(f"Requested loan amount is too high relative to annual income (Loan/Income ratio: {features['loan_amount'] / features['annual_income']:.2f}).")
        elif features.get('annual_income', 0) <= 0 and features.get('loan_amount', 0) > 0:
             decision = "DENIED"
             reasons.append("No verifiable annual income provided for a loan request.")


        if not reasons:
            reasons.append("Meets basic underwriting criteria.")

        logger.info(f"Decision: {decision}, Reasons: {reasons}")
        return decision, reasons

    def _calculate_interest_rate(self,
                                 risk_score: float,
                                 features: Dict[str, Any]) -> float:
        """
        Calculates the interest rate based on the risk score and other factors.

        Args:
            risk_score (float): The predicted credit risk score.
            features (Dict[str, Any]): Engineered features.

        Returns:
            float: The calculated annual interest rate.
        """
        logger.debug(f"Calculating interest rate for risk score {risk_score:.4f}")

        # Get base rate adjustment from the mock model (or a separate rate model)
        _, base_rate_adjustment = self.model(features)

        # Start with base rate
        interest_rate = self.base_interest_rate

        # Add risk premium based on the predicted risk score
        # The higher the risk, the higher the premium
        interest_rate += risk_score * self.risk_premium_factor

        # Add the adjustment from the mock model
        interest_rate += base_rate_adjustment

        # Apply additional adjustments based on specific features (e.g., very low credit score)
        if features.get('credit_score', 0) < 650:
            interest_rate += 0.01 # Add 1% for lower credit scores

        if features.get('loan_term_months', 0) > 60: # Longer terms might have slightly higher rates
            interest_rate += 0.005

        # Ensure interest rate is within a reasonable range (e.g., 3% to 25%)
        interest_rate = np.clip(interest_rate, self.base_interest_rate, 0.25)

        logger.info(f"Calculated interest rate: {interest_rate:.4f}")
        return float(interest_rate)

    def underwrite(self, financial_data: Dict[str, Any], loan_request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Performs the complete loan underwriting process.

        Args:
            financial_data (Dict[str, Any]): Raw financial information of the applicant.
                                              Example: {
                                                  'annual_income': 75000.0,
                                                  'monthly_debt_payments': 1200.0,
                                                  'credit_score': 720,
                                                  'employment_status': 'employed',
                                                  'employment_duration_months': 48,
                                                  'assets_value': 150000.0,
                                                  'liabilities_value': 50000.0,
                                                  'bank_account_balance': 15000.0
                                              }
            loan_request (Dict[str, Any]): Details of the requested loan.
                                            Example: {
                                                'loan_amount': 25000.0,
                                                'loan_term_months': 36,
                                                'loan_purpose': 'debt_consolidation'
                                            }

        Returns:
            Dict[str, Any]: A comprehensive underwriting decision.
                            Example: {
                                'status': 'APPROVED',
                                'risk_score': 0.35,
                                'interest_rate': 0.075,
                                'reasons': ['Meets basic underwriting criteria.'],
                                'recommended_loan_amount': 25000.0, # Could be adjusted by AI
                                'recommended_loan_term_months': 36 # Could be adjusted by AI
                            }
        """
        logger.info(f"Starting underwriting for loan request: {loan_request.get('loan_amount')} for {financial_data.get('annual_income')} income.")

        # 1. Preprocess data
        features = self._preprocess_data(financial_data, loan_request)

        # 2. Predict risk score
        risk_score = self._predict_risk(features)

        # 3. Determine approval decision and reasons
        decision_status, reasons = self._determine_decision(risk_score, features)

        # 4. Calculate interest rate (only if approved, or provide a default if denied)
        interest_rate = None
        if decision_status == "APPROVED":
            interest_rate = self._calculate_interest_rate(risk_score, features)
        else:
            # For denied loans, we might still calculate a hypothetical rate or set to None
            interest_rate = None # Or a very high default rate to indicate unsuitability

        # 5. Construct the final decision object
        underwriting_result = {
            'status': decision_status,
            'risk_score': round(risk_score, 4),
            'interest_rate': round(interest_rate, 4) if interest_rate is not None else None,
            'reasons': reasons,
            'recommended_loan_amount': loan_request.get('loan_amount'), # For now, same as requested
            'recommended_loan_term_months': loan_request.get('loan_term_months'), # For now, same as requested
            'processed_features': features # Include for transparency/debugging
        }

        logger.info(f"Underwriting complete. Decision: {underwriting_result['status']}")
        return underwriting_result

# Example Usage (for testing purposes, would be removed in final production code or moved to a test file)
if __name__ == "__main__":
    ai_underwriter = UnderwritingAI()

    # Scenario 1: High-income, good credit, low debt
    financial_data_1 = {
        'annual_income': 120000.0,
        'monthly_debt_payments': 800.0,
        'credit_score': 780,
        'employment_status': 'employed',
        'employment_duration_months': 120,
        'assets_value': 300000.0,
        'liabilities_value': 100000.0,
        'bank_account_balance': 50000.0
    }
    loan_request_1 = {
        'loan_amount': 30000.0,
        'loan_term_months': 48,
        'loan_purpose': 'home_improvement'
    }
    print("\n--- Scenario 1: Excellent Applicant ---")
    result_1 = ai_underwriter.underwrite(financial_data_1, loan_request_1)
    print(f"Result: {result_1}")
    assert result_1['status'] == 'APPROVED'
    assert result_1['interest_rate'] is not None
    assert result_1['risk_score'] < 0.4

    # Scenario 2: Moderate income, average credit, some debt
    financial_data_2 = {
        'annual_income': 60000.0,
        'monthly_debt_payments': 1000.0,
        'credit_score': 680,
        'employment_status': 'employed',
        'employment_duration_months': 36,
        'assets_value': 50000.0,
        'liabilities_value': 20000.0,
        'bank_account_balance': 8000.0
    }
    loan_request_2 = {
        'loan_amount': 15000.0,
        'loan_term_months': 60,
        'loan_purpose': 'car_purchase'
    }
    print("\n--- Scenario 2: Moderate Applicant ---")
    result_2 = ai_underwriter.underwrite(financial_data_2, loan_request_2)
    print(f"Result: {result_2}")
    assert result_2['status'] == 'APPROVED'
    assert result_2['interest_rate'] is not None
    assert result_2['risk_score'] > result_1['risk_score']
    assert result_2['interest_rate'] > result_1['interest_rate']

    # Scenario 3: Low income, poor credit, high debt
    financial_data_3 = {
        'annual_income': 35000.0,
        'monthly_debt_payments': 1500.0, # High DTI
        'credit_score': 580, # Below min
        'employment_status': 'employed',
        'employment_duration_months': 12,
        'assets_value': 10000.0,
        'liabilities_value': 15000.0,
        'bank_account_balance': 2000.0
    }
    loan_request_3 = {
        'loan_amount': 10000.0,
        'loan_term_months': 24,
        'loan_purpose': 'emergency'
    }
    print("\n--- Scenario 3: High Risk Applicant (Denied) ---")
    result_3 = ai_underwriter.underwrite(financial_data_3, loan_request_3)
    print(f"Result: {result_3}")
    assert result_3['status'] == 'DENIED'
    assert result_3['interest_rate'] is None
    assert 'Credit score' in result_3['reasons'][0] or 'Debt-to-income ratio' in result_3['reasons'][0]

    # Scenario 4: No income
    financial_data_4 = {
        'annual_income': 0.0,
        'monthly_debt_payments': 0.0,
        'credit_score': 700,
        'employment_status': 'unemployed',
        'employment_duration_months': 0,
        'assets_value': 10000.0,
        'liabilities_value': 0.0,
        'bank_account_balance': 5000.0
    }
    loan_request_4 = {
        'loan_amount': 5000.0,
        'loan_term_months': 12,
        'loan_purpose': 'short_term_need'
    }
    print("\n--- Scenario 4: No Income Applicant (Denied) ---")
    result_4 = ai_underwriter.underwrite(financial_data_4, loan_request_4)
    print(f"Result: {result_4}")
    assert result_4['status'] == 'DENIED'
    assert 'No verifiable annual income' in result_4['reasons']

    # Scenario 5: Loan amount too high for income
    financial_data_5 = {
        'annual_income': 40000.0,
        'monthly_debt_payments': 500.0,
        'credit_score': 700,
        'employment_status': 'employed',
        'employment_duration_months': 60,
        'assets_value': 20000.0,
        'liabilities_value': 10000.0,
        'bank_account_balance': 5000.0
    }
    loan_request_5 = {
        'loan_amount': 50000.0, # 1.25x annual income, might be too high
        'loan_term_months': 60,
        'loan_purpose': 'large_purchase'
    }
    print("\n--- Scenario 5: Loan Amount Too High for Income (Denied) ---")
    result_5 = ai_underwriter.underwrite(financial_data_5, loan_request_5)
    print(f"Result: {result_5}")
    assert result_5['status'] == 'DENIED'
    assert 'Loan amount is too high relative to annual income' in result_5['reasons']