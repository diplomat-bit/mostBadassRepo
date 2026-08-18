// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/api.md
================================================================================

# Users

Types:

```python
from aibanking.types import UserLoginResponse, UserRegisterResponse
```

Methods:

- <code title="post /users/login">client.users.<a href="./src/aibanking/resources/users/users.py">login</a>(\*\*<a href="src/aibanking/types/user_login_params.py">params</a>) -> <a href="./src/aibanking/types/user_login_response.py">UserLoginResponse</a></code>
- <code title="post /users/logout">client.users.<a href="./src/aibanking/resources/users/users.py">logout</a>() -> None</code>
- <code title="post /users/register">client.users.<a href="./src/aibanking/resources/users/users.py">register</a>(\*\*<a href="src/aibanking/types/user_register_params.py">params</a>) -> <a href="./src/aibanking/types/user_register_response.py">UserRegisterResponse</a></code>

## PasswordReset

Types:

```python
from aibanking.types.users import PasswordResetConfirmResponse, PasswordResetInitiateResponse
```

Methods:

- <code title="post /users/password-reset/confirm">client.users.password_reset.<a href="./src/aibanking/resources/users/password_reset.py">confirm</a>(\*\*<a href="src/aibanking/types/users/password_reset_confirm_params.py">params</a>) -> <a href="./src/aibanking/types/users/password_reset_confirm_response.py">PasswordResetConfirmResponse</a></code>
- <code title="post /users/password-reset/initiate">client.users.password_reset.<a href="./src/aibanking/resources/users/password_reset.py">initiate</a>(\*\*<a href="src/aibanking/types/users/password_reset_initiate_params.py">params</a>) -> <a href="./src/aibanking/types/users/password_reset_initiate_response.py">PasswordResetInitiateResponse</a></code>

## Me

Types:

```python
from aibanking.types.users import MeRetrieveResponse
```

Methods:

- <code title="get /users/me">client.users.me.<a href="./src/aibanking/resources/users/me/me.py">retrieve</a>() -> <a href="./src/aibanking/types/users/me_retrieve_response.py">MeRetrieveResponse</a></code>
- <code title="put /users/me">client.users.me.<a href="./src/aibanking/resources/users/me/me.py">update</a>() -> None</code>
- <code title="delete /users/me">client.users.me.<a href="./src/aibanking/resources/users/me/me.py">delete</a>() -> None</code>

### Preferences

Types:

```python
from aibanking.types.users.me import PreferenceRetrieveResponse, PreferenceUpdateResponse
```

Methods:

- <code title="get /users/me/preferences">client.users.me.preferences.<a href="./src/aibanking/resources/users/me/preferences.py">retrieve</a>() -> <a href="./src/aibanking/types/users/me/preference_retrieve_response.py">PreferenceRetrieveResponse</a></code>
- <code title="put /users/me/preferences">client.users.me.preferences.<a href="./src/aibanking/resources/users/me/preferences.py">update</a>(\*\*<a href="src/aibanking/types/users/me/preference_update_params.py">params</a>) -> <a href="./src/aibanking/types/users/me/preference_update_response.py">PreferenceUpdateResponse</a></code>

### Security

Types:

```python
from aibanking.types.users.me import SecurityRetrieveLogResponse, SecurityRotateKeysResponse
```

Methods:

- <code title="get /users/me/security/log">client.users.me.security.<a href="./src/aibanking/resources/users/me/security.py">retrieve_log</a>(\*\*<a href="src/aibanking/types/users/me/security_retrieve_log_params.py">params</a>) -> <a href="./src/aibanking/types/users/me/security_retrieve_log_response.py">SecurityRetrieveLogResponse</a></code>
- <code title="post /users/me/security/rotate-keys">client.users.me.security.<a href="./src/aibanking/resources/users/me/security.py">rotate_keys</a>() -> <a href="./src/aibanking/types/users/me/security_rotate_keys_response.py">SecurityRotateKeysResponse</a></code>

### Devices

Types:

```python
from aibanking.types.users.me import DeviceListResponse
```

Methods:

- <code title="get /users/me/devices">client.users.me.devices.<a href="./src/aibanking/resources/users/me/devices.py">list</a>() -> <a href="./src/aibanking/types/users/me/device_list_response.py">DeviceListResponse</a></code>
- <code title="delete /users/me/devices/{deviceId}">client.users.me.devices.<a href="./src/aibanking/resources/users/me/devices.py">deregister</a>(device_id) -> None</code>
- <code title="post /users/me/devices">client.users.me.devices.<a href="./src/aibanking/resources/users/me/devices.py">register</a>(\*\*<a href="src/aibanking/types/users/me/device_register_params.py">params</a>) -> None</code>

### Biometrics

Types:

```python
from aibanking.types.users.me import BiometricRetrieveStatusResponse, BiometricVerifyResponse
```

Methods:

- <code title="post /users/me/biometrics/enroll">client.users.me.biometrics.<a href="./src/aibanking/resources/users/me/biometrics.py">enroll</a>(\*\*<a href="src/aibanking/types/users/me/biometric_enroll_params.py">params</a>) -> None</code>
- <code title="delete /users/me/biometrics">client.users.me.biometrics.<a href="./src/aibanking/resources/users/me/biometrics.py">remove_all</a>() -> None</code>
- <code title="get /users/me/biometrics">client.users.me.biometrics.<a href="./src/aibanking/resources/users/me/biometrics.py">retrieve_status</a>() -> <a href="./src/aibanking/types/users/me/biometric_retrieve_status_response.py">BiometricRetrieveStatusResponse</a></code>
- <code title="post /users/me/biometrics/verify">client.users.me.biometrics.<a href="./src/aibanking/resources/users/me/biometrics.py">verify</a>(\*\*<a href="src/aibanking/types/users/me/biometric_verify_params.py">params</a>) -> <a href="./src/aibanking/types/users/me/biometric_verify_response.py">BiometricVerifyResponse</a></code>

# Accounts

Types:

```python
from aibanking.types import (
    AccountLinkResponse,
    AccountOpenResponse,
    AccountRetrieveBalanceHistoryResponse,
    AccountRetrieveDetailsResponse,
    AccountRetrieveMeResponse,
)
```

Methods:

- <code title="delete /accounts/{accountId}">client.accounts.<a href="./src/aibanking/resources/accounts/accounts.py">delete</a>(account_id) -> None</code>
- <code title="post /accounts/link">client.accounts.<a href="./src/aibanking/resources/accounts/accounts.py">link</a>(\*\*<a href="src/aibanking/types/account_link_params.py">params</a>) -> <a href="./src/aibanking/types/account_link_response.py">AccountLinkResponse</a></code>
- <code title="post /accounts/open">client.accounts.<a href="./src/aibanking/resources/accounts/accounts.py">open</a>(\*\*<a href="src/aibanking/types/account_open_params.py">params</a>) -> <a href="./src/aibanking/types/account_open_response.py">AccountOpenResponse</a></code>
- <code title="get /accounts/{accountId}/balance-history">client.accounts.<a href="./src/aibanking/resources/accounts/accounts.py">retrieve_balance_history</a>(account_id, \*\*<a href="src/aibanking/types/account_retrieve_balance_history_params.py">params</a>) -> <a href="./src/aibanking/types/account_retrieve_balance_history_response.py">AccountRetrieveBalanceHistoryResponse</a></code>
- <code title="get /accounts/{accountId}/details">client.accounts.<a href="./src/aibanking/resources/accounts/accounts.py">retrieve_details</a>(account_id) -> <a href="./src/aibanking/types/account_retrieve_details_response.py">AccountRetrieveDetailsResponse</a></code>
- <code title="get /accounts/me">client.accounts.<a href="./src/aibanking/resources/accounts/accounts.py">retrieve_me</a>() -> <a href="./src/aibanking/types/account_retrieve_me_response.py">AccountRetrieveMeResponse</a></code>

## Transactions

Types:

```python
from aibanking.types.accounts import (
    TransactionRetrieveArchivedResponse,
    TransactionRetrievePendingResponse,
)
```

Methods:

- <code title="get /accounts/{accountId}/transactions/archived">client.accounts.transactions.<a href="./src/aibanking/resources/accounts/transactions.py">retrieve_archived</a>(account_id, \*\*<a href="src/aibanking/types/accounts/transaction_retrieve_archived_params.py">params</a>) -> <a href="./src/aibanking/types/accounts/transaction_retrieve_archived_response.py">TransactionRetrieveArchivedResponse</a></code>
- <code title="get /accounts/{accountId}/transactions/pending">client.accounts.transactions.<a href="./src/aibanking/resources/accounts/transactions.py">retrieve_pending</a>(account_id) -> <a href="./src/aibanking/types/accounts/transaction_retrieve_pending_response.py">TransactionRetrievePendingResponse</a></code>

## Statements

Types:

```python
from aibanking.types.accounts import StatementListResponse
```

Methods:

- <code title="get /accounts/{accountId}/statements">client.accounts.statements.<a href="./src/aibanking/resources/accounts/statements.py">list</a>(account_id) -> <a href="./src/aibanking/types/accounts/statement_list_response.py">StatementListResponse</a></code>
- <code title="get /accounts/{accountId}/statements/{statementId}/pdf">client.accounts.statements.<a href="./src/aibanking/resources/accounts/statements.py">retrieve_pdf</a>(statement_id, \*, account_id) -> None</code>

## OverdraftSettings

Types:

```python
from aibanking.types.accounts import OverdraftSettingRetrieveOverdraftSettingsResponse
```

Methods:

- <code title="get /accounts/{accountId}/overdraft-settings">client.accounts.overdraft_settings.<a href="./src/aibanking/resources/accounts/overdraft_settings.py">retrieve_overdraft_settings</a>(account_id) -> <a href="./src/aibanking/types/accounts/overdraft_setting_retrieve_overdraft_settings_response.py">OverdraftSettingRetrieveOverdraftSettingsResponse</a></code>
- <code title="put /accounts/{accountId}/overdraft-settings">client.accounts.overdraft_settings.<a href="./src/aibanking/resources/accounts/overdraft_settings.py">update_overdraft_settings</a>(account_id, \*\*<a href="src/aibanking/types/accounts/overdraft_setting_update_overdraft_settings_params.py">params</a>) -> None</code>

# Transactions

Types:

```python
from aibanking.types import (
    TransactionRetrieveResponse,
    TransactionListResponse,
    TransactionCategorizeResponse,
)
```

Methods:

- <code title="get /transactions/{transactionId}">client.transactions.<a href="./src/aibanking/resources/transactions/transactions.py">retrieve</a>(transaction_id) -> <a href="./src/aibanking/types/transaction_retrieve_response.py">TransactionRetrieveResponse</a></code>
- <code title="get /transactions">client.transactions.<a href="./src/aibanking/resources/transactions/transactions.py">list</a>(\*\*<a href="src/aibanking/types/transaction_list_params.py">params</a>) -> <a href="./src/aibanking/types/transaction_list_response.py">TransactionListResponse</a></code>
- <code title="put /transactions/{transactionId}/notes">client.transactions.<a href="./src/aibanking/resources/transactions/transactions.py">add_notes</a>(transaction_id, \*\*<a href="src/aibanking/types/transaction_add_notes_params.py">params</a>) -> None</code>
- <code title="put /transactions/{transactionId}/categorize">client.transactions.<a href="./src/aibanking/resources/transactions/transactions.py">categorize</a>(transaction_id, \*\*<a href="src/aibanking/types/transaction_categorize_params.py">params</a>) -> <a href="./src/aibanking/types/transaction_categorize_response.py">TransactionCategorizeResponse</a></code>
- <code title="post /transactions/{transactionId}/dispute">client.transactions.<a href="./src/aibanking/resources/transactions/transactions.py">initiate_dispute</a>(transaction_id, \*\*<a href="src/aibanking/types/transaction_initiate_dispute_params.py">params</a>) -> None</code>
- <code title="post /transactions/{transactionId}/split">client.transactions.<a href="./src/aibanking/resources/transactions/transactions.py">split</a>(transaction_id, \*\*<a href="src/aibanking/types/transaction_split_params.py">params</a>) -> None</code>

## Recurring

Types:

```python
from aibanking.types.transactions import RecurringListResponse
```

Methods:

- <code title="post /transactions/recurring">client.transactions.recurring.<a href="./src/aibanking/resources/transactions/recurring.py">create</a>(\*\*<a href="src/aibanking/types/transactions/recurring_create_params.py">params</a>) -> None</code>
- <code title="get /transactions/recurring">client.transactions.recurring.<a href="./src/aibanking/resources/transactions/recurring.py">list</a>() -> <a href="./src/aibanking/types/transactions/recurring_list_response.py">RecurringListResponse</a></code>
- <code title="delete /transactions/recurring/{recurringId}">client.transactions.recurring.<a href="./src/aibanking/resources/transactions/recurring.py">cancel</a>(recurring_id) -> None</code>

## Insights

Types:

```python
from aibanking.types.transactions import (
    InsightGetCashFlowPredictionResponse,
    InsightGetSpendingTrendsResponse,
)
```

Methods:

- <code title="get /transactions/insights/future-flow">client.transactions.insights.<a href="./src/aibanking/resources/transactions/insights.py">get_cash_flow_prediction</a>() -> <a href="./src/aibanking/types/transactions/insight_get_cash_flow_prediction_response.py">InsightGetCashFlowPredictionResponse</a></code>
- <code title="get /transactions/insights/spending-trends">client.transactions.insights.<a href="./src/aibanking/resources/transactions/insights.py">get_spending_trends</a>() -> <a href="./src/aibanking/types/transactions/insight_get_spending_trends_response.py">InsightGetSpendingTrendsResponse</a></code>

# AI

## Oracle

### Simulate

Types:

```python
from aibanking.types.ai.oracle import SimulateCreateResponse, SimulateAdvancedResponse
```

Methods:

- <code title="post /ai/oracle/simulate">client.ai.oracle.simulate.<a href="./src/aibanking/resources/ai/oracle/simulate.py">create</a>(\*\*<a href="src/aibanking/types/ai/oracle/simulate_create_params.py">params</a>) -> <a href="./src/aibanking/types/ai/oracle/simulate_create_response.py">SimulateCreateResponse</a></code>
- <code title="post /ai/oracle/simulate/advanced">client.ai.oracle.simulate.<a href="./src/aibanking/resources/ai/oracle/simulate.py">advanced</a>(\*\*<a href="src/aibanking/types/ai/oracle/simulate_advanced_params.py">params</a>) -> <a href="./src/aibanking/types/ai/oracle/simulate_advanced_response.py">SimulateAdvancedResponse</a></code>
- <code title="post /ai/oracle/simulate/monte-carlo">client.ai.oracle.simulate.<a href="./src/aibanking/resources/ai/oracle/simulate.py">monte_carlo</a>(\*\*<a href="src/aibanking/types/ai/oracle/simulate_monte_carlo_params.py">params</a>) -> None</code>

### Predictions

Types:

```python
from aibanking.types.ai.oracle import (
    PredictionRetrieveInflationResponse,
    PredictionRetrieveMarketCrashProbabilityResponse,
)
```

Methods:

- <code title="get /ai/oracle/predictions/inflation">client.ai.oracle.predictions.<a href="./src/aibanking/resources/ai/oracle/predictions.py">retrieve_inflation</a>(\*\*<a href="src/aibanking/types/ai/oracle/prediction_retrieve_inflation_params.py">params</a>) -> <a href="./src/aibanking/types/ai/oracle/prediction_retrieve_inflation_response.py">PredictionRetrieveInflationResponse</a></code>
- <code title="get /ai/oracle/predictions/market-crash-probability">client.ai.oracle.predictions.<a href="./src/aibanking/resources/ai/oracle/predictions.py">retrieve_market_crash_probability</a>() -> <a href="./src/aibanking/types/ai/oracle/prediction_retrieve_market_crash_probability_response.py">PredictionRetrieveMarketCrashProbabilityResponse</a></code>

### Simulations

Types:

```python
from aibanking.types.ai.oracle import SimulationRetrieveResponse, SimulationListResponse
```

Methods:

- <code title="get /ai/oracle/simulations/{simulationId}">client.ai.oracle.simulations.<a href="./src/aibanking/resources/ai/oracle/simulations.py">retrieve</a>(simulation_id) -> <a href="./src/aibanking/types/ai/oracle/simulation_retrieve_response.py">SimulationRetrieveResponse</a></code>
- <code title="get /ai/oracle/simulations">client.ai.oracle.simulations.<a href="./src/aibanking/resources/ai/oracle/simulations.py">list</a>() -> <a href="./src/aibanking/types/ai/oracle/simulation_list_response.py">SimulationListResponse</a></code>

## Incubator

Types:

```python
from aibanking.types.ai import IncubatorRetrievePitchesResponse, IncubatorValidateResponse
```

Methods:

- <code title="get /ai/incubator/pitches">client.ai.incubator.<a href="./src/aibanking/resources/ai/incubator/incubator.py">retrieve_pitches</a>() -> <a href="./src/aibanking/types/ai/incubator_retrieve_pitches_response.py">IncubatorRetrievePitchesResponse</a></code>
- <code title="post /ai/incubator/validate">client.ai.incubator.<a href="./src/aibanking/resources/ai/incubator/incubator.py">validate</a>(\*\*<a href="src/aibanking/types/ai/incubator_validate_params.py">params</a>) -> <a href="./src/aibanking/types/ai/incubator_validate_response.py">IncubatorValidateResponse</a></code>

### Pitch

Types:

```python
from aibanking.types.ai.incubator import PitchCreateResponse, PitchRetrieveDetailsResponse
```

Methods:

- <code title="post /ai/incubator/pitch">client.ai.incubator.pitch.<a href="./src/aibanking/resources/ai/incubator/pitch.py">create</a>(\*\*<a href="src/aibanking/types/ai/incubator/pitch_create_params.py">params</a>) -> <a href="./src/aibanking/types/ai/incubator/pitch_create_response.py">PitchCreateResponse</a></code>
- <code title="get /ai/incubator/pitch/{pitchId}/details">client.ai.incubator.pitch.<a href="./src/aibanking/resources/ai/incubator/pitch.py">retrieve_details</a>(pitch_id) -> <a href="./src/aibanking/types/ai/incubator/pitch_retrieve_details_response.py">PitchRetrieveDetailsResponse</a></code>
- <code title="put /ai/incubator/pitch/{pitchId}/feedback">client.ai.incubator.pitch.<a href="./src/aibanking/resources/ai/incubator/pitch.py">update_feedback</a>(pitch_id, \*\*<a href="src/aibanking/types/ai/incubator/pitch_update_feedback_params.py">params</a>) -> None</code>

### Analysis

Types:

```python
from aibanking.types.ai.incubator import AnalysisCompetitorsResponse, AnalysisSwotResponse
```

Methods:

- <code title="post /ai/incubator/analysis/competitors">client.ai.incubator.analysis.<a href="./src/aibanking/resources/ai/incubator/analysis.py">competitors</a>(\*\*<a href="src/aibanking/types/ai/incubator/analysis_competitors_params.py">params</a>) -> <a href="./src/aibanking/types/ai/incubator/analysis_competitors_response.py">AnalysisCompetitorsResponse</a></code>
- <code title="post /ai/incubator/analysis/swot">client.ai.incubator.analysis.<a href="./src/aibanking/resources/ai/incubator/analysis.py">swot</a>(\*\*<a href="src/aibanking/types/ai/incubator/analysis_swot_params.py">params</a>) -> <a href="./src/aibanking/types/ai/incubator/analysis_swot_response.py">AnalysisSwotResponse</a></code>

## Ads

Types:

```python
from aibanking.types.ai import AdRetrieveResponse, AdListResponse, AdOptimizeResponse
```

Methods:

- <code title="get /ai/ads/operations/{operationId}">client.ai.ads.<a href="./src/aibanking/resources/ai/ads/ads.py">retrieve</a>(operation_id) -> <a href="./src/aibanking/types/ai/ad_retrieve_response.py">AdRetrieveResponse</a></code>
- <code title="get /ai/ads">client.ai.ads.<a href="./src/aibanking/resources/ai/ads/ads.py">list</a>() -> <a href="./src/aibanking/types/ai/ad_list_response.py">AdListResponse</a></code>
- <code title="post /ai/ads/optimize">client.ai.ads.<a href="./src/aibanking/resources/ai/ads/ads.py">optimize</a>(\*\*<a href="src/aibanking/types/ai/ad_optimize_params.py">params</a>) -> <a href="./src/aibanking/types/ai/ad_optimize_response.py">AdOptimizeResponse</a></code>

### Generate

Types:

```python
from aibanking.types.ai.ads import GenerateCopyResponse, GenerateVideoResponse
```

Methods:

- <code title="post /ai/ads/generate/copy">client.ai.ads.generate.<a href="./src/aibanking/resources/ai/ads/generate.py">copy</a>(\*\*<a href="src/aibanking/types/ai/ads/generate_copy_params.py">params</a>) -> <a href="./src/aibanking/types/ai/ads/generate_copy_response.py">GenerateCopyResponse</a></code>
- <code title="post /ai/ads/generate/video">client.ai.ads.generate.<a href="./src/aibanking/resources/ai/ads/generate.py">video</a>(\*\*<a href="src/aibanking/types/ai/ads/generate_video_params.py">params</a>) -> <a href="./src/aibanking/types/ai/ads/generate_video_response.py">GenerateVideoResponse</a></code>

## Advisor

### Chat

Types:

```python
from aibanking.types.ai.advisor import ChatCreateResponse, ChatRetrieveHistoryResponse
```

Methods:

- <code title="post /ai/advisor/chat">client.ai.advisor.chat.<a href="./src/aibanking/resources/ai/advisor/chat.py">create</a>(\*\*<a href="src/aibanking/types/ai/advisor/chat_create_params.py">params</a>) -> <a href="./src/aibanking/types/ai/advisor/chat_create_response.py">ChatCreateResponse</a></code>
- <code title="get /ai/advisor/chat/history">client.ai.advisor.chat.<a href="./src/aibanking/resources/ai/advisor/chat.py">retrieve_history</a>() -> <a href="./src/aibanking/types/ai/advisor/chat_retrieve_history_response.py">ChatRetrieveHistoryResponse</a></code>

### Tools

Types:

```python
from aibanking.types.ai.advisor import ToolListResponse
```

Methods:

- <code title="get /ai/advisor/tools">client.ai.advisor.tools.<a href="./src/aibanking/resources/ai/advisor/tools.py">list</a>() -> <a href="./src/aibanking/types/ai/advisor/tool_list_response.py">ToolListResponse</a></code>
- <code title="post /ai/advisor/tools/{toolId}/enable">client.ai.advisor.tools.<a href="./src/aibanking/resources/ai/advisor/tools.py">enable</a>(tool_id) -> None</code>

## Agent

Types:

```python
from aibanking.types.ai import AgentRetrieveCapabilitiesResponse
```

Methods:

- <code title="get /ai/agent/capabilities">client.ai.agent.<a href="./src/aibanking/resources/ai/agent/agent.py">retrieve_capabilities</a>() -> <a href="./src/aibanking/types/ai/agent_retrieve_capabilities_response.py">AgentRetrieveCapabilitiesResponse</a></code>

### Prompts

Types:

```python
from aibanking.types.ai.agent import PromptListResponse
```

Methods:

- <code title="put /ai/agent/prompts">client.ai.agent.prompts.<a href="./src/aibanking/resources/ai/agent/prompts.py">create</a>(\*\*<a href="src/aibanking/types/ai/agent/prompt_create_params.py">params</a>) -> None</code>
- <code title="get /ai/agent/prompts">client.ai.agent.prompts.<a href="./src/aibanking/resources/ai/agent/prompts.py">list</a>() -> <a href="./src/aibanking/types/ai/agent/prompt_list_response.py">PromptListResponse</a></code>

## Models

Types:

```python
from aibanking.types.ai import ModelFineTuneResponse, ModelRetrieveVersionsResponse
```

Methods:

- <code title="post /ai/models/fine-tune">client.ai.models.<a href="./src/aibanking/resources/ai/models.py">fine_tune</a>(\*\*<a href="src/aibanking/types/ai/model_fine_tune_params.py">params</a>) -> <a href="./src/aibanking/types/ai/model_fine_tune_response.py">ModelFineTuneResponse</a></code>
- <code title="get /ai/models/versions">client.ai.models.<a href="./src/aibanking/resources/ai/models.py">retrieve_versions</a>() -> <a href="./src/aibanking/types/ai/model_retrieve_versions_response.py">ModelRetrieveVersionsResponse</a></code>

# Corporate

Types:

```python
from aibanking.types import CorporateOnboardResponse
```

Methods:

- <code title="post /corporate/onboard">client.corporate.<a href="./src/aibanking/resources/corporate/corporate.py">onboard</a>(\*\*<a href="src/aibanking/types/corporate_onboard_params.py">params</a>) -> <a href="./src/aibanking/types/corporate_onboard_response.py">CorporateOnboardResponse</a></code>

## Compliance

Types:

```python
from aibanking.types.corporate import (
    ComplianceScreenMediaResponse,
    ComplianceScreenPepResponse,
    ComplianceScreenSanctionsResponse,
)
```

Methods:

- <code title="post /corporate/compliance/media">client.corporate.compliance.<a href="./src/aibanking/resources/corporate/compliance/compliance.py">screen_media</a>(\*\*<a href="src/aibanking/types/corporate/compliance_screen_media_params.py">params</a>) -> <a href="./src/aibanking/types/corporate/compliance_screen_media_response.py">ComplianceScreenMediaResponse</a></code>
- <code title="post /corporate/compliance/pep">client.corporate.compliance.<a href="./src/aibanking/resources/corporate/compliance/compliance.py">screen_pep</a>(\*\*<a href="src/aibanking/types/corporate/compliance_screen_pep_params.py">params</a>) -> <a href="./src/aibanking/types/corporate/compliance_screen_pep_response.py">ComplianceScreenPepResponse</a></code>
- <code title="post /corporate/compliance/sanctions">client.corporate.compliance.<a href="./src/aibanking/resources/corporate/compliance/compliance.py">screen_sanctions</a>(\*\*<a href="src/aibanking/types/corporate/compliance_screen_sanctions_params.py">params</a>) -> <a href="./src/aibanking/types/corporate/compliance_screen_sanctions_response.py">ComplianceScreenSanctionsResponse</a></code>

### Audits

Types:

```python
from aibanking.types.corporate.compliance import (
    AuditRequestAuditResponse,
    AuditRetrieveReportResponse,
)
```

Methods:

- <code title="post /corporate/compliance/audits">client.corporate.compliance.audits.<a href="./src/aibanking/resources/corporate/compliance/audits.py">request_audit</a>(\*\*<a href="src/aibanking/types/corporate/compliance/audit_request_audit_params.py">params</a>) -> <a href="./src/aibanking/types/corporate/compliance/audit_request_audit_response.py">AuditRequestAuditResponse</a></code>
- <code title="get /corporate/compliance/audits/{auditId}/report">client.corporate.compliance.audits.<a href="./src/aibanking/resources/corporate/compliance/audits.py">retrieve_report</a>(audit_id) -> <a href="./src/aibanking/types/corporate/compliance/audit_retrieve_report_response.py">AuditRetrieveReportResponse</a></code>

## Treasury

Types:

```python
from aibanking.types.corporate import TreasuryGetLiquidityPositionsResponse
```

Methods:

- <code title="post /corporate/treasury/bulk-payouts">client.corporate.treasury.<a href="./src/aibanking/resources/corporate/treasury/treasury.py">execute_bulk_payouts</a>(\*\*<a href="src/aibanking/types/corporate/treasury_execute_bulk_payouts_params.py">params</a>) -> None</code>
- <code title="get /corporate/treasury/liquidity-positions">client.corporate.treasury.<a href="./src/aibanking/resources/corporate/treasury/treasury.py">get_liquidity_positions</a>() -> <a href="./src/aibanking/types/corporate/treasury_get_liquidity_positions_response.py">TreasuryGetLiquidityPositionsResponse</a></code>

### CashFlow

Types:

```python
from aibanking.types.corporate.treasury import CashFlowForecastResponse
```

Methods:

- <code title="get /corporate/treasury/cash-flow/forecast">client.corporate.treasury.cash_flow.<a href="./src/aibanking/resources/corporate/treasury/cash_flow.py">forecast</a>(\*\*<a href="src/aibanking/types/corporate/treasury/cash_flow_forecast_params.py">params</a>) -> <a href="./src/aibanking/types/corporate/treasury/cash_flow_forecast_response.py">CashFlowForecastResponse</a></code>

### Liquidity

Types:

```python
from aibanking.types.corporate.treasury import LiquidityOptimizeResponse
```

Methods:

- <code title="post /corporate/treasury/liquidity/pooling">client.corporate.treasury.liquidity.<a href="./src/aibanking/resources/corporate/treasury/liquidity.py">configure_pooling</a>(\*\*<a href="src/aibanking/types/corporate/treasury/liquidity_configure_pooling_params.py">params</a>) -> None</code>
- <code title="post /corporate/treasury/liquidity/optimize">client.corporate.treasury.liquidity.<a href="./src/aibanking/resources/corporate/treasury/liquidity.py">optimize</a>(\*\*<a href="src/aibanking/types/corporate/treasury/liquidity_optimize_params.py">params</a>) -> <a href="./src/aibanking/types/corporate/treasury/liquidity_optimize_response.py">LiquidityOptimizeResponse</a></code>

### Sweeping

Methods:

- <code title="post /corporate/treasury/sweeping/rules">client.corporate.treasury.sweeping.<a href="./src/aibanking/resources/corporate/treasury/sweeping.py">configure_rules</a>(\*\*<a href="src/aibanking/types/corporate/treasury/sweeping_configure_rules_params.py">params</a>) -> None</code>
- <code title="post /corporate/treasury/sweeping/execute">client.corporate.treasury.sweeping.<a href="./src/aibanking/resources/corporate/treasury/sweeping.py">execute_sweep</a>(\*\*<a href="src/aibanking/types/corporate/treasury/sweeping_execute_sweep_params.py">params</a>) -> None</code>

## Cards

Types:

```python
from aibanking.types.corporate import (
    CardGetTransactionsResponse,
    CardIssueVirtualCardResponse,
    CardListAllResponse,
    CardRequestPhysicalCardResponse,
)
```

Methods:

- <code title="get /corporate/cards/{cardId}/transactions">client.corporate.cards.<a href="./src/aibanking/resources/corporate/cards.py">get_transactions</a>(card_id) -> <a href="./src/aibanking/types/corporate/card_get_transactions_response.py">CardGetTransactionsResponse</a></code>
- <code title="post /corporate/cards/virtual">client.corporate.cards.<a href="./src/aibanking/resources/corporate/cards.py">issue_virtual_card</a>(\*\*<a href="src/aibanking/types/corporate/card_issue_virtual_card_params.py">params</a>) -> <a href="./src/aibanking/types/corporate/card_issue_virtual_card_response.py">CardIssueVirtualCardResponse</a></code>
- <code title="get /corporate/cards">client.corporate.cards.<a href="./src/aibanking/resources/corporate/cards.py">list_all</a>(\*\*<a href="src/aibanking/types/corporate/card_list_all_params.py">params</a>) -> <a href="./src/aibanking/types/corporate/card_list_all_response.py">CardListAllResponse</a></code>
- <code title="post /corporate/cards/physical">client.corporate.cards.<a href="./src/aibanking/resources/corporate/cards.py">request_physical_card</a>(\*\*<a href="src/aibanking/types/corporate/card_request_physical_card_params.py">params</a>) -> <a href="./src/aibanking/types/corporate/card_request_physical_card_response.py">CardRequestPhysicalCardResponse</a></code>
- <code title="post /corporate/cards/{cardId}/freeze">client.corporate.cards.<a href="./src/aibanking/resources/corporate/cards.py">toggle_card_lock</a>(card_id, \*\*<a href="src/aibanking/types/corporate/card_toggle_card_lock_params.py">params</a>) -> None</code>
- <code title="put /corporate/cards/{cardId}/controls">client.corporate.cards.<a href="./src/aibanking/resources/corporate/cards.py">update_controls</a>(card_id, \*\*<a href="src/aibanking/types/corporate/card_update_controls_params.py">params</a>) -> None</code>

## Risk

Types:

```python
from aibanking.types.corporate import RiskGetRiskExposureResponse, RiskRunStressTestResponse
```

Methods:

- <code title="get /corporate/risk/exposure">client.corporate.risk.<a href="./src/aibanking/resources/corporate/risk/risk.py">get_risk_exposure</a>() -> <a href="./src/aibanking/types/corporate/risk_get_risk_exposure_response.py">RiskGetRiskExposureResponse</a></code>
- <code title="post /corporate/risk/stress-test">client.corporate.risk.<a href="./src/aibanking/resources/corporate/risk/risk.py">run_stress_test</a>(\*\*<a href="src/aibanking/types/corporate/risk_run_stress_test_params.py">params</a>) -> <a href="./src/aibanking/types/corporate/risk_run_stress_test_response.py">RiskRunStressTestResponse</a></code>

### Fraud

Types:

```python
from aibanking.types.corporate.risk import FraudAnalyzeTransactionResponse
```

Methods:

- <code title="post /corporate/risk/fraud/analyze">client.corporate.risk.fraud.<a href="./src/aibanking/resources/corporate/risk/fraud/fraud.py">analyze_transaction</a>(\*\*<a href="src/aibanking/types/corporate/risk/fraud_analyze_transaction_params.py">params</a>) -> <a href="./src/aibanking/types/corporate/risk/fraud_analyze_transaction_response.py">FraudAnalyzeTransactionResponse</a></code>

#### Rules

Types:

```python
from aibanking.types.corporate.risk.fraud import RuleListActiveResponse
```

Methods:

- <code title="post /corporate/risk/fraud/rules">client.corporate.risk.fraud.rules.<a href="./src/aibanking/resources/corporate/risk/fraud/rules.py">create_custom</a>(\*\*<a href="src/aibanking/types/corporate/risk/fraud/rule_create_custom_params.py">params</a>) -> None</code>
- <code title="get /corporate/risk/fraud/rules">client.corporate.risk.fraud.rules.<a href="./src/aibanking/resources/corporate/risk/fraud/rules.py">list_active</a>() -> <a href="./src/aibanking/types/corporate/risk/fraud/rule_list_active_response.py">RuleListActiveResponse</a></code>
- <code title="put /corporate/risk/fraud/rules/{ruleId}">client.corporate.risk.fraud.rules.<a href="./src/aibanking/resources/corporate/risk/fraud/rules.py">update_rule</a>(rule_id, \*\*<a href="src/aibanking/types/corporate/risk/fraud/rule_update_rule_params.py">params</a>) -> None</code>

## Governance

### Proposals

Types:

```python
from aibanking.types.corporate.governance import ProposalListActiveResponse
```

Methods:

- <code title="post /corporate/governance/proposals/{proposalId}/vote">client.corporate.governance.proposals.<a href="./src/aibanking/resources/corporate/governance/proposals.py">cast_vote</a>(proposal_id, \*\*<a href="src/aibanking/types/corporate/governance/proposal_cast_vote_params.py">params</a>) -> None</code>
- <code title="post /corporate/governance/proposals">client.corporate.governance.proposals.<a href="./src/aibanking/resources/corporate/governance/proposals.py">create_new</a>(\*\*<a href="src/aibanking/types/corporate/governance/proposal_create_new_params.py">params</a>) -> None</code>
- <code title="get /corporate/governance/proposals">client.corporate.governance.proposals.<a href="./src/aibanking/resources/corporate/governance/proposals.py">list_active</a>() -> <a href="./src/aibanking/types/corporate/governance/proposal_list_active_response.py">ProposalListActiveResponse</a></code>

## Anomalies

Types:

```python
from aibanking.types.corporate import AnomalyListDetectedResponse
```

Methods:

- <code title="get /corporate/anomalies">client.corporate.anomalies.<a href="./src/aibanking/resources/corporate/anomalies.py">list_detected</a>() -> <a href="./src/aibanking/types/corporate/anomaly_list_detected_response.py">AnomalyListDetectedResponse</a></code>
- <code title="put /corporate/anomalies/{anomalyId}/status">client.corporate.anomalies.<a href="./src/aibanking/resources/corporate/anomalies.py">update_status</a>(anomaly_id, \*\*<a href="src/aibanking/types/corporate/anomaly_update_status_params.py">params</a>) -> None</code>

# Web3

## Network

Types:

```python
from aibanking.types.web3 import NetworkGetStatusResponse
```

Methods:

- <code title="get /web3/network/status">client.web3.network.<a href="./src/aibanking/resources/web3/network.py">get_status</a>() -> <a href="./src/aibanking/types/web3/network_get_status_response.py">NetworkGetStatusResponse</a></code>

## Wallets

Types:

```python
from aibanking.types.web3 import WalletCreateResponse, WalletListResponse, WalletGetBalancesResponse
```

Methods:

- <code title="post /web3/wallets">client.web3.wallets.<a href="./src/aibanking/resources/web3/wallets.py">create</a>(\*\*<a href="src/aibanking/types/web3/wallet_create_params.py">params</a>) -> <a href="./src/aibanking/types/web3/wallet_create_response.py">WalletCreateResponse</a></code>
- <code title="get /web3/wallets">client.web3.wallets.<a href="./src/aibanking/resources/web3/wallets.py">list</a>() -> <a href="./src/aibanking/types/web3/wallet_list_response.py">WalletListResponse</a></code>
- <code title="get /web3/wallets/{walletId}/balances">client.web3.wallets.<a href="./src/aibanking/resources/web3/wallets.py">get_balances</a>(wallet_id) -> <a href="./src/aibanking/types/web3/wallet_get_balances_response.py">WalletGetBalancesResponse</a></code>
- <code title="post /web3/wallets/connect">client.web3.wallets.<a href="./src/aibanking/resources/web3/wallets.py">link</a>(\*\*<a href="src/aibanking/types/web3/wallet_link_params.py">params</a>) -> None</code>

## Transactions

Types:

```python
from aibanking.types.web3 import TransactionSendResponse
```

Methods:

- <code title="post /web3/transactions/bridge">client.web3.transactions.<a href="./src/aibanking/resources/web3/transactions.py">bridge</a>(\*\*<a href="src/aibanking/types/web3/transaction_bridge_params.py">params</a>) -> None</code>
- <code title="post /web3/transactions/initiate">client.web3.transactions.<a href="./src/aibanking/resources/web3/transactions.py">initiate</a>(\*\*<a href="src/aibanking/types/web3/transaction_initiate_params.py">params</a>) -> None</code>
- <code title="post /web3/transactions/send">client.web3.transactions.<a href="./src/aibanking/resources/web3/transactions.py">send</a>(\*\*<a href="src/aibanking/types/web3/transaction_send_params.py">params</a>) -> <a href="./src/aibanking/types/web3/transaction_send_response.py">TransactionSendResponse</a></code>
- <code title="post /web3/transactions/swap">client.web3.transactions.<a href="./src/aibanking/resources/web3/transactions.py">swap</a>(\*\*<a href="src/aibanking/types/web3/transaction_swap_params.py">params</a>) -> None</code>

## NFTs

Types:

```python
from aibanking.types.web3 import NFTListResponse
```

Methods:

- <code title="get /web3/nfts">client.web3.nfts.<a href="./src/aibanking/resources/web3/nfts.py">list</a>() -> <a href="./src/aibanking/types/web3/nft_list_response.py">NFTListResponse</a></code>
- <code title="post /web3/nfts/mint">client.web3.nfts.<a href="./src/aibanking/resources/web3/nfts.py">mint</a>(\*\*<a href="src/aibanking/types/web3/nft_mint_params.py">params</a>) -> None</code>

## Contracts

Methods:

- <code title="post /web3/contracts/deploy">client.web3.contracts.<a href="./src/aibanking/resources/web3/contracts.py">deploy</a>(\*\*<a href="src/aibanking/types/web3/contract_deploy_params.py">params</a>) -> None</code>

# Payments

Types:

```python
from aibanking.types import PaymentListResponse
```

Methods:

- <code title="get /payments/{paymentId}">client.payments.<a href="./src/aibanking/resources/payments/payments.py">retrieve</a>(payment_id) -> None</code>
- <code title="get /payments">client.payments.<a href="./src/aibanking/resources/payments/payments.py">list</a>() -> <a href="./src/aibanking/types/payment_list_response.py">PaymentListResponse</a></code>

## Domestic

Methods:

- <code title="post /payments/domestic/ach">client.payments.domestic.<a href="./src/aibanking/resources/payments/domestic.py">execute_ach</a>(\*\*<a href="src/aibanking/types/payments/domestic_execute_ach_params.py">params</a>) -> None</code>
- <code title="post /payments/domestic/rtp">client.payments.domestic.<a href="./src/aibanking/resources/payments/domestic.py">execute_rtp</a>(\*\*<a href="src/aibanking/types/payments/domestic_execute_rtp_params.py">params</a>) -> None</code>
- <code title="post /payments/domestic/wire">client.payments.domestic.<a href="./src/aibanking/resources/payments/domestic.py">execute_wire</a>(\*\*<a href="src/aibanking/types/payments/domestic_execute_wire_params.py">params</a>) -> None</code>

## International

Types:

```python
from aibanking.types.payments import InternationalGetStatusResponse
```

Methods:

- <code title="post /payments/international/sepa">client.payments.international.<a href="./src/aibanking/resources/payments/international.py">execute_sepa</a>(\*\*<a href="src/aibanking/types/payments/international_execute_sepa_params.py">params</a>) -> None</code>
- <code title="post /payments/international/swift">client.payments.international.<a href="./src/aibanking/resources/payments/international.py">execute_swift</a>(\*\*<a href="src/aibanking/types/payments/international_execute_swift_params.py">params</a>) -> None</code>
- <code title="get /payments/international/{paymentId}/status">client.payments.international.<a href="./src/aibanking/resources/payments/international.py">get_status</a>(payment_id) -> <a href="./src/aibanking/types/payments/international_get_status_response.py">InternationalGetStatusResponse</a></code>

## Fx

Types:

```python
from aibanking.types.payments import FxGetRatesResponse
```

Methods:

- <code title="post /payments/fx/deals">client.payments.fx.<a href="./src/aibanking/resources/payments/fx.py">book_deal</a>(\*\*<a href="src/aibanking/types/payments/fx_book_deal_params.py">params</a>) -> None</code>
- <code title="post /payments/fx/convert">client.payments.fx.<a href="./src/aibanking/resources/payments/fx.py">execute_conversion</a>(\*\*<a href="src/aibanking/types/payments/fx_execute_conversion_params.py">params</a>) -> None</code>
- <code title="get /payments/fx/rates">client.payments.fx.<a href="./src/aibanking/resources/payments/fx.py">get_rates</a>(\*\*<a href="src/aibanking/types/payments/fx_get_rates_params.py">params</a>) -> <a href="./src/aibanking/types/payments/fx_get_rates_response.py">FxGetRatesResponse</a></code>

# Sustainability

Types:

```python
from aibanking.types import SustainabilityRetrieveCarbonFootprintResponse
```

Methods:

- <code title="get /sustainability/carbon-footprint">client.sustainability.<a href="./src/aibanking/resources/sustainability/sustainability.py">retrieve_carbon_footprint</a>() -> <a href="./src/aibanking/types/sustainability_retrieve_carbon_footprint_response.py">SustainabilityRetrieveCarbonFootprintResponse</a></code>

## Offsets

Methods:

- <code title="post /sustainability/offsets/purchase">client.sustainability.offsets.<a href="./src/aibanking/resources/sustainability/offsets.py">purchase_credits</a>(\*\*<a href="src/aibanking/types/sustainability/offset_purchase_credits_params.py">params</a>) -> None</code>
- <code title="post /sustainability/offsets/retire">client.sustainability.offsets.<a href="./src/aibanking/resources/sustainability/offsets.py">retire_credits</a>(\*\*<a href="src/aibanking/types/sustainability/offset_retire_credits_params.py">params</a>) -> None</code>

## Impact

Types:

```python
from aibanking.types.sustainability import (
    ImpactListGlobalGreenProjectsResponse,
    ImpactRetrievePortfolioImpactResponse,
)
```

Methods:

- <code title="get /sustainability/impact/projects">client.sustainability.impact.<a href="./src/aibanking/resources/sustainability/impact.py">list_global_green_projects</a>(\*\*<a href="src/aibanking/types/sustainability/impact_list_global_green_projects_params.py">params</a>) -> <a href="./src/aibanking/types/sustainability/impact_list_global_green_projects_response.py">ImpactListGlobalGreenProjectsResponse</a></code>
- <code title="get /sustainability/impact/portfolio">client.sustainability.impact.<a href="./src/aibanking/resources/sustainability/impact.py">retrieve_portfolio_impact</a>() -> <a href="./src/aibanking/types/sustainability/impact_retrieve_portfolio_impact_response.py">ImpactRetrievePortfolioImpactResponse</a></code>

# Marketplace

Types:

```python
from aibanking.types import MarketplaceListProductsResponse
```

Methods:

- <code title="get /marketplace/products">client.marketplace.<a href="./src/aibanking/resources/marketplace/marketplace.py">list_products</a>() -> <a href="./src/aibanking/types/marketplace_list_products_response.py">MarketplaceListProductsResponse</a></code>

## Offers

Types:

```python
from aibanking.types.marketplace import OfferListOffersResponse
```

Methods:

- <code title="get /marketplace/offers">client.marketplace.offers.<a href="./src/aibanking/resources/marketplace/offers.py">list_offers</a>() -> <a href="./src/aibanking/types/marketplace/offer_list_offers_response.py">OfferListOffersResponse</a></code>
- <code title="post /marketplace/offers/{offerId}/redeem">client.marketplace.offers.<a href="./src/aibanking/resources/marketplace/offers.py">redeem_offer</a>(offer_id) -> None</code>

# Lending

## Applications

Types:

```python
from aibanking.types.lending import ApplicationSubmitResponse, ApplicationTrackStatusResponse
```

Methods:

- <code title="post /lending/applications">client.lending.applications.<a href="./src/aibanking/resources/lending/applications.py">submit</a>(\*\*<a href="src/aibanking/types/lending/application_submit_params.py">params</a>) -> <a href="./src/aibanking/types/lending/application_submit_response.py">ApplicationSubmitResponse</a></code>
- <code title="get /lending/applications/{appId}/status">client.lending.applications.<a href="./src/aibanking/resources/lending/applications.py">track_status</a>(app_id) -> <a href="./src/aibanking/types/lending/application_track_status_response.py">ApplicationTrackStatusResponse</a></code>

## Decisions

Types:

```python
from aibanking.types.lending import DecisionGetRationaleResponse
```

Methods:

- <code title="get /lending/decisions/{decisionId}/rationale">client.lending.decisions.<a href="./src/aibanking/resources/lending/decisions.py">get_rationale</a>(decision_id) -> <a href="./src/aibanking/types/lending/decision_get_rationale_response.py">DecisionGetRationaleResponse</a></code>

# Investments

## Portfolios

Types:

```python
from aibanking.types.investments import PortfolioListResponse, PortfolioRebalanceResponse
```

Methods:

- <code title="post /investments/portfolios">client.investments.portfolios.<a href="./src/aibanking/resources/investments/portfolios.py">create</a>(\*\*<a href="src/aibanking/types/investments/portfolio_create_params.py">params</a>) -> None</code>
- <code title="get /investments/portfolios/{portfolioId}">client.investments.portfolios.<a href="./src/aibanking/resources/investments/portfolios.py">retrieve</a>(portfolio_id) -> None</code>
- <code title="put /investments/portfolios/{portfolioId}">client.investments.portfolios.<a href="./src/aibanking/resources/investments/portfolios.py">update</a>(portfolio_id, \*\*<a href="src/aibanking/types/investments/portfolio_update_params.py">params</a>) -> None</code>
- <code title="get /investments/portfolios">client.investments.portfolios.<a href="./src/aibanking/resources/investments/portfolios.py">list</a>(\*\*<a href="src/aibanking/types/investments/portfolio_list_params.py">params</a>) -> <a href="./src/aibanking/types/investments/portfolio_list_response.py">PortfolioListResponse</a></code>
- <code title="post /investments/portfolios/{portfolioId}/rebalance">client.investments.portfolios.<a href="./src/aibanking/resources/investments/portfolios.py">rebalance</a>(portfolio_id, \*\*<a href="src/aibanking/types/investments/portfolio_rebalance_params.py">params</a>) -> <a href="./src/aibanking/types/investments/portfolio_rebalance_response.py">PortfolioRebalanceResponse</a></code>

## Assets

Types:

```python
from aibanking.types.investments import AssetSearchResponse
```

Methods:

- <code title="get /investments/assets/search">client.investments.assets.<a href="./src/aibanking/resources/investments/assets.py">search</a>(\*\*<a href="src/aibanking/types/investments/asset_search_params.py">params</a>) -> <a href="./src/aibanking/types/investments/asset_search_response.py">AssetSearchResponse</a></code>

## Performance

Types:

```python
from aibanking.types.investments import PerformanceGetHistoricalResponse
```

Methods:

- <code title="get /investments/performance/historical">client.investments.performance.<a href="./src/aibanking/resources/investments/performance.py">get_historical</a>(\*\*<a href="src/aibanking/types/investments/performance_get_historical_params.py">params</a>) -> <a href="./src/aibanking/types/investments/performance_get_historical_response.py">PerformanceGetHistoricalResponse</a></code>

# System

Types:

```python
from aibanking.types import SystemGetAuditLogsResponse, SystemGetStatusResponse
```

Methods:

- <code title="get /system/audit-logs">client.system.<a href="./src/aibanking/resources/system/system.py">get_audit_logs</a>(\*\*<a href="src/aibanking/types/system_get_audit_logs_params.py">params</a>) -> <a href="./src/aibanking/types/system_get_audit_logs_response.py">SystemGetAuditLogsResponse</a></code>
- <code title="get /system/status">client.system.<a href="./src/aibanking/resources/system/system.py">get_status</a>() -> <a href="./src/aibanking/types/system_get_status_response.py">SystemGetStatusResponse</a></code>

## Webhooks

Types:

```python
from aibanking.types.system import WebhookListResponse
```

Methods:

- <code title="get /system/webhooks">client.system.webhooks.<a href="./src/aibanking/resources/system/webhooks.py">list</a>() -> <a href="./src/aibanking/types/system/webhook_list_response.py">WebhookListResponse</a></code>
- <code title="delete /system/webhooks/{webhookId}">client.system.webhooks.<a href="./src/aibanking/resources/system/webhooks.py">delete</a>(webhook_id) -> None</code>
- <code title="post /system/webhooks">client.system.webhooks.<a href="./src/aibanking/resources/system/webhooks.py">register</a>(\*\*<a href="src/aibanking/types/system/webhook_register_params.py">params</a>) -> None</code>

## Sandbox

Types:

```python
from aibanking.types.system import SandboxSimulateErrorResponse
```

Methods:

- <code title="post /system/sandbox/reset">client.system.sandbox.<a href="./src/aibanking/resources/system/sandbox.py">reset</a>() -> None</code>
- <code title="post /system/sandbox/simulate-error">client.system.sandbox.<a href="./src/aibanking/resources/system/sandbox.py">simulate_error</a>(\*\*<a href="src/aibanking/types/system/sandbox_simulate_error_params.py">params</a>) -> <a href="./src/aibanking/types/system/sandbox_simulate_error_response.py">SandboxSimulateErrorResponse</a></code>

## Verification

Methods:

- <code title="post /system/verification/biometric-comparison">client.system.verification.<a href="./src/aibanking/resources/system/verification.py">compare_biometric</a>(\*\*<a href="src/aibanking/types/system/verification_compare_biometric_params.py">params</a>) -> None</code>
- <code title="post /system/verification/document">client.system.verification.<a href="./src/aibanking/resources/system/verification.py">verify_document</a>() -> None</code>

## Notifications

Types:

```python
from aibanking.types.system import NotificationListTemplatesResponse
```

Methods:

- <code title="get /system/notifications/templates">client.system.notifications.<a href="./src/aibanking/resources/system/notifications.py">list_templates</a>() -> <a href="./src/aibanking/types/system/notification_list_templates_response.py">NotificationListTemplatesResponse</a></code>
- <code title="post /system/notifications/push">client.system.notifications.<a href="./src/aibanking/resources/system/notifications.py">send_push</a>(\*\*<a href="src/aibanking/types/system/notification_send_push_params.py">params</a>) -> None</code>


================================================================================
// APPENDED FROM REPO: diplomat-bit/garbage-typescript | ORIGINAL PATH: diplomat-bit-garbage-typescript-95791a2/api.md
================================================================================

# Users

Types:

- <code><a href="./src/resources/users/users.ts">UserLoginResponse</a></code>
- <code><a href="./src/resources/users/users.ts">UserRegisterResponse</a></code>

Methods:

- <code title="post /users/login">client.users.<a href="./src/resources/users/users.ts">login</a>({ ...params }) -> UserLoginResponse</code>
- <code title="post /users/logout">client.users.<a href="./src/resources/users/users.ts">logout</a>() -> void</code>
- <code title="post /users/register">client.users.<a href="./src/resources/users/users.ts">register</a>({ ...params }) -> UserRegisterResponse</code>

## PasswordReset

Types:

- <code><a href="./src/resources/users/password-reset.ts">PasswordResetConfirmResponse</a></code>
- <code><a href="./src/resources/users/password-reset.ts">PasswordResetInitiateResponse</a></code>

Methods:

- <code title="post /users/password-reset/confirm">client.users.passwordReset.<a href="./src/resources/users/password-reset.ts">confirm</a>({ ...params }) -> PasswordResetConfirmResponse</code>
- <code title="post /users/password-reset/initiate">client.users.passwordReset.<a href="./src/resources/users/password-reset.ts">initiate</a>({ ...params }) -> PasswordResetInitiateResponse</code>

## Me

Types:

- <code><a href="./src/resources/users/me/me.ts">MeRetrieveResponse</a></code>

Methods:

- <code title="get /users/me">client.users.me.<a href="./src/resources/users/me/me.ts">retrieve</a>() -> MeRetrieveResponse</code>
- <code title="put /users/me">client.users.me.<a href="./src/resources/users/me/me.ts">update</a>() -> void</code>
- <code title="delete /users/me">client.users.me.<a href="./src/resources/users/me/me.ts">delete</a>() -> void</code>

### Preferences

Types:

- <code><a href="./src/resources/users/me/preferences.ts">PreferenceRetrieveResponse</a></code>
- <code><a href="./src/resources/users/me/preferences.ts">PreferenceUpdateResponse</a></code>

Methods:

- <code title="get /users/me/preferences">client.users.me.preferences.<a href="./src/resources/users/me/preferences.ts">retrieve</a>() -> PreferenceRetrieveResponse</code>
- <code title="put /users/me/preferences">client.users.me.preferences.<a href="./src/resources/users/me/preferences.ts">update</a>({ ...params }) -> PreferenceUpdateResponse</code>

### Security

Types:

- <code><a href="./src/resources/users/me/security.ts">SecurityRetrieveLogResponse</a></code>
- <code><a href="./src/resources/users/me/security.ts">SecurityRotateKeysResponse</a></code>

Methods:

- <code title="get /users/me/security/log">client.users.me.security.<a href="./src/resources/users/me/security.ts">retrieveLog</a>({ ...params }) -> SecurityRetrieveLogResponse</code>
- <code title="post /users/me/security/rotate-keys">client.users.me.security.<a href="./src/resources/users/me/security.ts">rotateKeys</a>() -> SecurityRotateKeysResponse</code>

### Devices

Types:

- <code><a href="./src/resources/users/me/devices.ts">DeviceListResponse</a></code>

Methods:

- <code title="get /users/me/devices">client.users.me.devices.<a href="./src/resources/users/me/devices.ts">list</a>() -> DeviceListResponse</code>
- <code title="delete /users/me/devices/{deviceId}">client.users.me.devices.<a href="./src/resources/users/me/devices.ts">deregister</a>(deviceID) -> void</code>
- <code title="post /users/me/devices">client.users.me.devices.<a href="./src/resources/users/me/devices.ts">register</a>({ ...params }) -> void</code>

### Biometrics

Types:

- <code><a href="./src/resources/users/me/biometrics.ts">BiometricRetrieveStatusResponse</a></code>
- <code><a href="./src/resources/users/me/biometrics.ts">BiometricVerifyResponse</a></code>

Methods:

- <code title="post /users/me/biometrics/enroll">client.users.me.biometrics.<a href="./src/resources/users/me/biometrics.ts">enroll</a>({ ...params }) -> void</code>
- <code title="delete /users/me/biometrics">client.users.me.biometrics.<a href="./src/resources/users/me/biometrics.ts">removeAll</a>() -> void</code>
- <code title="get /users/me/biometrics">client.users.me.biometrics.<a href="./src/resources/users/me/biometrics.ts">retrieveStatus</a>() -> BiometricRetrieveStatusResponse</code>
- <code title="post /users/me/biometrics/verify">client.users.me.biometrics.<a href="./src/resources/users/me/biometrics.ts">verify</a>({ ...params }) -> BiometricVerifyResponse</code>

# Accounts

Types:

- <code><a href="./src/resources/accounts/accounts.ts">AccountLinkResponse</a></code>
- <code><a href="./src/resources/accounts/accounts.ts">AccountOpenResponse</a></code>
- <code><a href="./src/resources/accounts/accounts.ts">AccountRetrieveBalanceHistoryResponse</a></code>
- <code><a href="./src/resources/accounts/accounts.ts">AccountRetrieveDetailsResponse</a></code>
- <code><a href="./src/resources/accounts/accounts.ts">AccountRetrieveMeResponse</a></code>

Methods:

- <code title="delete /accounts/{accountId}">client.accounts.<a href="./src/resources/accounts/accounts.ts">delete</a>(accountID) -> void</code>
- <code title="post /accounts/link">client.accounts.<a href="./src/resources/accounts/accounts.ts">link</a>({ ...params }) -> AccountLinkResponse</code>
- <code title="post /accounts/open">client.accounts.<a href="./src/resources/accounts/accounts.ts">open</a>({ ...params }) -> AccountOpenResponse</code>
- <code title="get /accounts/{accountId}/balance-history">client.accounts.<a href="./src/resources/accounts/accounts.ts">retrieveBalanceHistory</a>(accountID, { ...params }) -> AccountRetrieveBalanceHistoryResponse</code>
- <code title="get /accounts/{accountId}/details">client.accounts.<a href="./src/resources/accounts/accounts.ts">retrieveDetails</a>(accountID) -> AccountRetrieveDetailsResponse</code>
- <code title="get /accounts/me">client.accounts.<a href="./src/resources/accounts/accounts.ts">retrieveMe</a>() -> AccountRetrieveMeResponse</code>

## Transactions

Types:

- <code><a href="./src/resources/accounts/transactions.ts">TransactionRetrieveArchivedResponse</a></code>
- <code><a href="./src/resources/accounts/transactions.ts">TransactionRetrievePendingResponse</a></code>

Methods:

- <code title="get /accounts/{accountId}/transactions/archived">client.accounts.transactions.<a href="./src/resources/accounts/transactions.ts">retrieveArchived</a>(accountID, { ...params }) -> TransactionRetrieveArchivedResponse</code>
- <code title="get /accounts/{accountId}/transactions/pending">client.accounts.transactions.<a href="./src/resources/accounts/transactions.ts">retrievePending</a>(accountID) -> TransactionRetrievePendingResponse</code>

## Statements

Types:

- <code><a href="./src/resources/accounts/statements.ts">StatementListResponse</a></code>

Methods:

- <code title="get /accounts/{accountId}/statements">client.accounts.statements.<a href="./src/resources/accounts/statements.ts">list</a>(accountID) -> StatementListResponse</code>
- <code title="get /accounts/{accountId}/statements/{statementId}/pdf">client.accounts.statements.<a href="./src/resources/accounts/statements.ts">retrievePdf</a>(statementID, { ...params }) -> void</code>

## OverdraftSettings

Types:

- <code><a href="./src/resources/accounts/overdraft-settings.ts">OverdraftSettingRetrieveOverdraftSettingsResponse</a></code>

Methods:

- <code title="get /accounts/{accountId}/overdraft-settings">client.accounts.overdraftSettings.<a href="./src/resources/accounts/overdraft-settings.ts">retrieveOverdraftSettings</a>(accountID) -> OverdraftSettingRetrieveOverdraftSettingsResponse</code>
- <code title="put /accounts/{accountId}/overdraft-settings">client.accounts.overdraftSettings.<a href="./src/resources/accounts/overdraft-settings.ts">updateOverdraftSettings</a>(accountID, { ...params }) -> void</code>

# Transactions

Types:

- <code><a href="./src/resources/transactions/transactions.ts">TransactionRetrieveResponse</a></code>
- <code><a href="./src/resources/transactions/transactions.ts">TransactionListResponse</a></code>
- <code><a href="./src/resources/transactions/transactions.ts">TransactionCategorizeResponse</a></code>

Methods:

- <code title="get /transactions/{transactionId}">client.transactions.<a href="./src/resources/transactions/transactions.ts">retrieve</a>(transactionID) -> TransactionRetrieveResponse</code>
- <code title="get /transactions">client.transactions.<a href="./src/resources/transactions/transactions.ts">list</a>({ ...params }) -> TransactionListResponse</code>
- <code title="put /transactions/{transactionId}/notes">client.transactions.<a href="./src/resources/transactions/transactions.ts">addNotes</a>(transactionID, { ...params }) -> void</code>
- <code title="put /transactions/{transactionId}/categorize">client.transactions.<a href="./src/resources/transactions/transactions.ts">categorize</a>(transactionID, { ...params }) -> TransactionCategorizeResponse</code>
- <code title="post /transactions/{transactionId}/dispute">client.transactions.<a href="./src/resources/transactions/transactions.ts">initiateDispute</a>(transactionID, { ...params }) -> void</code>
- <code title="post /transactions/{transactionId}/split">client.transactions.<a href="./src/resources/transactions/transactions.ts">split</a>(transactionID, { ...params }) -> void</code>

## Recurring

Types:

- <code><a href="./src/resources/transactions/recurring.ts">RecurringListResponse</a></code>

Methods:

- <code title="post /transactions/recurring">client.transactions.recurring.<a href="./src/resources/transactions/recurring.ts">create</a>({ ...params }) -> void</code>
- <code title="get /transactions/recurring">client.transactions.recurring.<a href="./src/resources/transactions/recurring.ts">list</a>() -> RecurringListResponse</code>
- <code title="delete /transactions/recurring/{recurringId}">client.transactions.recurring.<a href="./src/resources/transactions/recurring.ts">cancel</a>(recurringID) -> void</code>

## Insights

Types:

- <code><a href="./src/resources/transactions/insights.ts">InsightGetCashFlowPredictionResponse</a></code>
- <code><a href="./src/resources/transactions/insights.ts">InsightGetSpendingTrendsResponse</a></code>

Methods:

- <code title="get /transactions/insights/future-flow">client.transactions.insights.<a href="./src/resources/transactions/insights.ts">getCashFlowPrediction</a>() -> InsightGetCashFlowPredictionResponse</code>
- <code title="get /transactions/insights/spending-trends">client.transactions.insights.<a href="./src/resources/transactions/insights.ts">getSpendingTrends</a>() -> InsightGetSpendingTrendsResponse</code>

# AI

## Oracle

### Simulate

Types:

- <code><a href="./src/resources/ai/oracle/simulate.ts">SimulateCreateResponse</a></code>
- <code><a href="./src/resources/ai/oracle/simulate.ts">SimulateAdvancedResponse</a></code>

Methods:

- <code title="post /ai/oracle/simulate">client.ai.oracle.simulate.<a href="./src/resources/ai/oracle/simulate.ts">create</a>({ ...params }) -> SimulateCreateResponse</code>
- <code title="post /ai/oracle/simulate/advanced">client.ai.oracle.simulate.<a href="./src/resources/ai/oracle/simulate.ts">advanced</a>({ ...params }) -> SimulateAdvancedResponse</code>
- <code title="post /ai/oracle/simulate/monte-carlo">client.ai.oracle.simulate.<a href="./src/resources/ai/oracle/simulate.ts">monteCarlo</a>({ ...params }) -> void</code>

### Predictions

Types:

- <code><a href="./src/resources/ai/oracle/predictions.ts">PredictionRetrieveInflationResponse</a></code>
- <code><a href="./src/resources/ai/oracle/predictions.ts">PredictionRetrieveMarketCrashProbabilityResponse</a></code>

Methods:

- <code title="get /ai/oracle/predictions/inflation">client.ai.oracle.predictions.<a href="./src/resources/ai/oracle/predictions.ts">retrieveInflation</a>({ ...params }) -> PredictionRetrieveInflationResponse</code>
- <code title="get /ai/oracle/predictions/market-crash-probability">client.ai.oracle.predictions.<a href="./src/resources/ai/oracle/predictions.ts">retrieveMarketCrashProbability</a>() -> PredictionRetrieveMarketCrashProbabilityResponse</code>

### Simulations

Types:

- <code><a href="./src/resources/ai/oracle/simulations.ts">SimulationRetrieveResponse</a></code>
- <code><a href="./src/resources/ai/oracle/simulations.ts">SimulationListResponse</a></code>

Methods:

- <code title="get /ai/oracle/simulations/{simulationId}">client.ai.oracle.simulations.<a href="./src/resources/ai/oracle/simulations.ts">retrieve</a>(simulationID) -> SimulationRetrieveResponse</code>
- <code title="get /ai/oracle/simulations">client.ai.oracle.simulations.<a href="./src/resources/ai/oracle/simulations.ts">list</a>() -> SimulationListResponse</code>

## Incubator

Types:

- <code><a href="./src/resources/ai/incubator/incubator.ts">IncubatorRetrievePitchesResponse</a></code>
- <code><a href="./src/resources/ai/incubator/incubator.ts">IncubatorValidateResponse</a></code>

Methods:

- <code title="get /ai/incubator/pitches">client.ai.incubator.<a href="./src/resources/ai/incubator/incubator.ts">retrievePitches</a>() -> IncubatorRetrievePitchesResponse</code>
- <code title="post /ai/incubator/validate">client.ai.incubator.<a href="./src/resources/ai/incubator/incubator.ts">validate</a>({ ...params }) -> IncubatorValidateResponse</code>

### Pitch

Types:

- <code><a href="./src/resources/ai/incubator/pitch.ts">PitchCreateResponse</a></code>
- <code><a href="./src/resources/ai/incubator/pitch.ts">PitchRetrieveDetailsResponse</a></code>

Methods:

- <code title="post /ai/incubator/pitch">client.ai.incubator.pitch.<a href="./src/resources/ai/incubator/pitch.ts">create</a>({ ...params }) -> PitchCreateResponse</code>
- <code title="get /ai/incubator/pitch/{pitchId}/details">client.ai.incubator.pitch.<a href="./src/resources/ai/incubator/pitch.ts">retrieveDetails</a>(pitchID) -> PitchRetrieveDetailsResponse</code>
- <code title="put /ai/incubator/pitch/{pitchId}/feedback">client.ai.incubator.pitch.<a href="./src/resources/ai/incubator/pitch.ts">updateFeedback</a>(pitchID, { ...params }) -> void</code>

### Analysis

Types:

- <code><a href="./src/resources/ai/incubator/analysis.ts">AnalysisCompetitorsResponse</a></code>
- <code><a href="./src/resources/ai/incubator/analysis.ts">AnalysisSwotResponse</a></code>

Methods:

- <code title="post /ai/incubator/analysis/competitors">client.ai.incubator.analysis.<a href="./src/resources/ai/incubator/analysis.ts">competitors</a>({ ...params }) -> AnalysisCompetitorsResponse</code>
- <code title="post /ai/incubator/analysis/swot">client.ai.incubator.analysis.<a href="./src/resources/ai/incubator/analysis.ts">swot</a>({ ...params }) -> AnalysisSwotResponse</code>

## Ads

Types:

- <code><a href="./src/resources/ai/ads/ads.ts">AdRetrieveResponse</a></code>
- <code><a href="./src/resources/ai/ads/ads.ts">AdListResponse</a></code>
- <code><a href="./src/resources/ai/ads/ads.ts">AdOptimizeResponse</a></code>

Methods:

- <code title="get /ai/ads/operations/{operationId}">client.ai.ads.<a href="./src/resources/ai/ads/ads.ts">retrieve</a>(operationID) -> AdRetrieveResponse</code>
- <code title="get /ai/ads">client.ai.ads.<a href="./src/resources/ai/ads/ads.ts">list</a>() -> AdListResponse</code>
- <code title="post /ai/ads/optimize">client.ai.ads.<a href="./src/resources/ai/ads/ads.ts">optimize</a>({ ...params }) -> AdOptimizeResponse</code>

### Generate

Types:

- <code><a href="./src/resources/ai/ads/generate.ts">GenerateCopyResponse</a></code>
- <code><a href="./src/resources/ai/ads/generate.ts">GenerateVideoResponse</a></code>

Methods:

- <code title="post /ai/ads/generate/copy">client.ai.ads.generate.<a href="./src/resources/ai/ads/generate.ts">copy</a>({ ...params }) -> GenerateCopyResponse</code>
- <code title="post /ai/ads/generate/video">client.ai.ads.generate.<a href="./src/resources/ai/ads/generate.ts">video</a>({ ...params }) -> GenerateVideoResponse</code>

## Advisor

### Chat

Types:

- <code><a href="./src/resources/ai/advisor/chat.ts">ChatCreateResponse</a></code>
- <code><a href="./src/resources/ai/advisor/chat.ts">ChatRetrieveHistoryResponse</a></code>

Methods:

- <code title="post /ai/advisor/chat">client.ai.advisor.chat.<a href="./src/resources/ai/advisor/chat.ts">create</a>({ ...params }) -> ChatCreateResponse</code>
- <code title="get /ai/advisor/chat/history">client.ai.advisor.chat.<a href="./src/resources/ai/advisor/chat.ts">retrieveHistory</a>() -> ChatRetrieveHistoryResponse</code>

### Tools

Types:

- <code><a href="./src/resources/ai/advisor/tools.ts">ToolListResponse</a></code>

Methods:

- <code title="get /ai/advisor/tools">client.ai.advisor.tools.<a href="./src/resources/ai/advisor/tools.ts">list</a>() -> ToolListResponse</code>
- <code title="post /ai/advisor/tools/{toolId}/enable">client.ai.advisor.tools.<a href="./src/resources/ai/advisor/tools.ts">enable</a>(toolID) -> void</code>

## Agent

Types:

- <code><a href="./src/resources/ai/agent/agent.ts">AgentRetrieveCapabilitiesResponse</a></code>

Methods:

- <code title="get /ai/agent/capabilities">client.ai.agent.<a href="./src/resources/ai/agent/agent.ts">retrieveCapabilities</a>() -> AgentRetrieveCapabilitiesResponse</code>

### Prompts

Types:

- <code><a href="./src/resources/ai/agent/prompts.ts">PromptListResponse</a></code>

Methods:

- <code title="put /ai/agent/prompts">client.ai.agent.prompts.<a href="./src/resources/ai/agent/prompts.ts">create</a>({ ...params }) -> void</code>
- <code title="get /ai/agent/prompts">client.ai.agent.prompts.<a href="./src/resources/ai/agent/prompts.ts">list</a>() -> PromptListResponse</code>

## Models

Types:

- <code><a href="./src/resources/ai/models.ts">ModelFineTuneResponse</a></code>
- <code><a href="./src/resources/ai/models.ts">ModelRetrieveVersionsResponse</a></code>

Methods:

- <code title="post /ai/models/fine-tune">client.ai.models.<a href="./src/resources/ai/models.ts">fineTune</a>({ ...params }) -> ModelFineTuneResponse</code>
- <code title="get /ai/models/versions">client.ai.models.<a href="./src/resources/ai/models.ts">retrieveVersions</a>() -> ModelRetrieveVersionsResponse</code>

# Corporate

Types:

- <code><a href="./src/resources/corporate/corporate.ts">CorporateOnboardResponse</a></code>

Methods:

- <code title="post /corporate/onboard">client.corporate.<a href="./src/resources/corporate/corporate.ts">onboard</a>({ ...params }) -> CorporateOnboardResponse</code>

## Compliance

Types:

- <code><a href="./src/resources/corporate/compliance/compliance.ts">ComplianceScreenMediaResponse</a></code>
- <code><a href="./src/resources/corporate/compliance/compliance.ts">ComplianceScreenPepResponse</a></code>
- <code><a href="./src/resources/corporate/compliance/compliance.ts">ComplianceScreenSanctionsResponse</a></code>

Methods:

- <code title="post /corporate/compliance/media">client.corporate.compliance.<a href="./src/resources/corporate/compliance/compliance.ts">screenMedia</a>({ ...params }) -> ComplianceScreenMediaResponse</code>
- <code title="post /corporate/compliance/pep">client.corporate.compliance.<a href="./src/resources/corporate/compliance/compliance.ts">screenPep</a>({ ...params }) -> ComplianceScreenPepResponse</code>
- <code title="post /corporate/compliance/sanctions">client.corporate.compliance.<a href="./src/resources/corporate/compliance/compliance.ts">screenSanctions</a>({ ...params }) -> ComplianceScreenSanctionsResponse</code>

### Audits

Types:

- <code><a href="./src/resources/corporate/compliance/audits.ts">AuditRequestAuditResponse</a></code>
- <code><a href="./src/resources/corporate/compliance/audits.ts">AuditRetrieveReportResponse</a></code>

Methods:

- <code title="post /corporate/compliance/audits">client.corporate.compliance.audits.<a href="./src/resources/corporate/compliance/audits.ts">requestAudit</a>({ ...params }) -> AuditRequestAuditResponse</code>
- <code title="get /corporate/compliance/audits/{auditId}/report">client.corporate.compliance.audits.<a href="./src/resources/corporate/compliance/audits.ts">retrieveReport</a>(auditID) -> AuditRetrieveReportResponse</code>

## Treasury

Types:

- <code><a href="./src/resources/corporate/treasury/treasury.ts">TreasuryGetLiquidityPositionsResponse</a></code>

Methods:

- <code title="post /corporate/treasury/bulk-payouts">client.corporate.treasury.<a href="./src/resources/corporate/treasury/treasury.ts">executeBulkPayouts</a>({ ...params }) -> void</code>
- <code title="get /corporate/treasury/liquidity-positions">client.corporate.treasury.<a href="./src/resources/corporate/treasury/treasury.ts">getLiquidityPositions</a>() -> TreasuryGetLiquidityPositionsResponse</code>

### CashFlow

Types:

- <code><a href="./src/resources/corporate/treasury/cash-flow.ts">CashFlowForecastResponse</a></code>

Methods:

- <code title="get /corporate/treasury/cash-flow/forecast">client.corporate.treasury.cashFlow.<a href="./src/resources/corporate/treasury/cash-flow.ts">forecast</a>({ ...params }) -> CashFlowForecastResponse</code>

### Liquidity

Types:

- <code><a href="./src/resources/corporate/treasury/liquidity.ts">LiquidityOptimizeResponse</a></code>

Methods:

- <code title="post /corporate/treasury/liquidity/pooling">client.corporate.treasury.liquidity.<a href="./src/resources/corporate/treasury/liquidity.ts">configurePooling</a>({ ...params }) -> void</code>
- <code title="post /corporate/treasury/liquidity/optimize">client.corporate.treasury.liquidity.<a href="./src/resources/corporate/treasury/liquidity.ts">optimize</a>({ ...params }) -> LiquidityOptimizeResponse</code>

### Sweeping

Methods:

- <code title="post /corporate/treasury/sweeping/rules">client.corporate.treasury.sweeping.<a href="./src/resources/corporate/treasury/sweeping.ts">configureRules</a>({ ...params }) -> void</code>
- <code title="post /corporate/treasury/sweeping/execute">client.corporate.treasury.sweeping.<a href="./src/resources/corporate/treasury/sweeping.ts">executeSweep</a>({ ...params }) -> void</code>

## Cards

Types:

- <code><a href="./src/resources/corporate/cards.ts">CardGetTransactionsResponse</a></code>
- <code><a href="./src/resources/corporate/cards.ts">CardIssueVirtualCardResponse</a></code>
- <code><a href="./src/resources/corporate/cards.ts">CardListAllResponse</a></code>
- <code><a href="./src/resources/corporate/cards.ts">CardRequestPhysicalCardResponse</a></code>

Methods:

- <code title="get /corporate/cards/{cardId}/transactions">client.corporate.cards.<a href="./src/resources/corporate/cards.ts">getTransactions</a>(cardID) -> CardGetTransactionsResponse</code>
- <code title="post /corporate/cards/virtual">client.corporate.cards.<a href="./src/resources/corporate/cards.ts">issueVirtualCard</a>({ ...params }) -> CardIssueVirtualCardResponse</code>
- <code title="get /corporate/cards">client.corporate.cards.<a href="./src/resources/corporate/cards.ts">listAll</a>({ ...params }) -> CardListAllResponse</code>
- <code title="post /corporate/cards/physical">client.corporate.cards.<a href="./src/resources/corporate/cards.ts">requestPhysicalCard</a>({ ...params }) -> CardRequestPhysicalCardResponse</code>
- <code title="post /corporate/cards/{cardId}/freeze">client.corporate.cards.<a href="./src/resources/corporate/cards.ts">toggleCardLock</a>(cardID, { ...params }) -> void</code>
- <code title="put /corporate/cards/{cardId}/controls">client.corporate.cards.<a href="./src/resources/corporate/cards.ts">updateControls</a>(cardID, { ...params }) -> void</code>

## Risk

Types:

- <code><a href="./src/resources/corporate/risk/risk.ts">RiskGetRiskExposureResponse</a></code>
- <code><a href="./src/resources/corporate/risk/risk.ts">RiskRunStressTestResponse</a></code>

Methods:

- <code title="get /corporate/risk/exposure">client.corporate.risk.<a href="./src/resources/corporate/risk/risk.ts">getRiskExposure</a>() -> RiskGetRiskExposureResponse</code>
- <code title="post /corporate/risk/stress-test">client.corporate.risk.<a href="./src/resources/corporate/risk/risk.ts">runStressTest</a>({ ...params }) -> RiskRunStressTestResponse</code>

### Fraud

Types:

- <code><a href="./src/resources/corporate/risk/fraud/fraud.ts">FraudAnalyzeTransactionResponse</a></code>

Methods:

- <code title="post /corporate/risk/fraud/analyze">client.corporate.risk.fraud.<a href="./src/resources/corporate/risk/fraud/fraud.ts">analyzeTransaction</a>({ ...params }) -> FraudAnalyzeTransactionResponse</code>

#### Rules

Types:

- <code><a href="./src/resources/corporate/risk/fraud/rules.ts">RuleListActiveResponse</a></code>

Methods:

- <code title="post /corporate/risk/fraud/rules">client.corporate.risk.fraud.rules.<a href="./src/resources/corporate/risk/fraud/rules.ts">createCustom</a>({ ...params }) -> void</code>
- <code title="get /corporate/risk/fraud/rules">client.corporate.risk.fraud.rules.<a href="./src/resources/corporate/risk/fraud/rules.ts">listActive</a>() -> RuleListActiveResponse</code>
- <code title="put /corporate/risk/fraud/rules/{ruleId}">client.corporate.risk.fraud.rules.<a href="./src/resources/corporate/risk/fraud/rules.ts">updateRule</a>(ruleID, { ...params }) -> void</code>

## Governance

### Proposals

Types:

- <code><a href="./src/resources/corporate/governance/proposals.ts">ProposalListActiveResponse</a></code>

Methods:

- <code title="post /corporate/governance/proposals/{proposalId}/vote">client.corporate.governance.proposals.<a href="./src/resources/corporate/governance/proposals.ts">castVote</a>(proposalID, { ...params }) -> void</code>
- <code title="post /corporate/governance/proposals">client.corporate.governance.proposals.<a href="./src/resources/corporate/governance/proposals.ts">createNew</a>({ ...params }) -> void</code>
- <code title="get /corporate/governance/proposals">client.corporate.governance.proposals.<a href="./src/resources/corporate/governance/proposals.ts">listActive</a>() -> ProposalListActiveResponse</code>

## Anomalies

Types:

- <code><a href="./src/resources/corporate/anomalies.ts">AnomalyListDetectedResponse</a></code>

Methods:

- <code title="get /corporate/anomalies">client.corporate.anomalies.<a href="./src/resources/corporate/anomalies.ts">listDetected</a>() -> AnomalyListDetectedResponse</code>
- <code title="put /corporate/anomalies/{anomalyId}/status">client.corporate.anomalies.<a href="./src/resources/corporate/anomalies.ts">updateStatus</a>(anomalyID, { ...params }) -> void</code>

# Web3

## Network

Types:

- <code><a href="./src/resources/web3/network.ts">NetworkGetStatusResponse</a></code>

Methods:

- <code title="get /web3/network/status">client.web3.network.<a href="./src/resources/web3/network.ts">getStatus</a>() -> NetworkGetStatusResponse</code>

## Wallets

Types:

- <code><a href="./src/resources/web3/wallets.ts">WalletCreateResponse</a></code>
- <code><a href="./src/resources/web3/wallets.ts">WalletListResponse</a></code>
- <code><a href="./src/resources/web3/wallets.ts">WalletGetBalancesResponse</a></code>

Methods:

- <code title="post /web3/wallets">client.web3.wallets.<a href="./src/resources/web3/wallets.ts">create</a>({ ...params }) -> WalletCreateResponse</code>
- <code title="get /web3/wallets">client.web3.wallets.<a href="./src/resources/web3/wallets.ts">list</a>() -> WalletListResponse</code>
- <code title="get /web3/wallets/{walletId}/balances">client.web3.wallets.<a href="./src/resources/web3/wallets.ts">getBalances</a>(walletID) -> WalletGetBalancesResponse</code>
- <code title="post /web3/wallets/connect">client.web3.wallets.<a href="./src/resources/web3/wallets.ts">link</a>({ ...params }) -> void</code>

## Transactions

Types:

- <code><a href="./src/resources/web3/transactions.ts">TransactionSendResponse</a></code>

Methods:

- <code title="post /web3/transactions/bridge">client.web3.transactions.<a href="./src/resources/web3/transactions.ts">bridge</a>({ ...params }) -> void</code>
- <code title="post /web3/transactions/initiate">client.web3.transactions.<a href="./src/resources/web3/transactions.ts">initiate</a>({ ...params }) -> void</code>
- <code title="post /web3/transactions/send">client.web3.transactions.<a href="./src/resources/web3/transactions.ts">send</a>({ ...params }) -> TransactionSendResponse</code>
- <code title="post /web3/transactions/swap">client.web3.transactions.<a href="./src/resources/web3/transactions.ts">swap</a>({ ...params }) -> void</code>

## NFTs

Types:

- <code><a href="./src/resources/web3/nfts.ts">NFTListResponse</a></code>

Methods:

- <code title="get /web3/nfts">client.web3.nfts.<a href="./src/resources/web3/nfts.ts">list</a>() -> NFTListResponse</code>
- <code title="post /web3/nfts/mint">client.web3.nfts.<a href="./src/resources/web3/nfts.ts">mint</a>({ ...params }) -> void</code>

## Contracts

Methods:

- <code title="post /web3/contracts/deploy">client.web3.contracts.<a href="./src/resources/web3/contracts.ts">deploy</a>({ ...params }) -> void</code>

# Payments

Types:

- <code><a href="./src/resources/payments/payments.ts">PaymentListResponse</a></code>

Methods:

- <code title="get /payments/{paymentId}">client.payments.<a href="./src/resources/payments/payments.ts">retrieve</a>(paymentID) -> void</code>
- <code title="get /payments">client.payments.<a href="./src/resources/payments/payments.ts">list</a>() -> PaymentListResponse</code>

## Domestic

Methods:

- <code title="post /payments/domestic/ach">client.payments.domestic.<a href="./src/resources/payments/domestic.ts">executeACH</a>({ ...params }) -> void</code>
- <code title="post /payments/domestic/rtp">client.payments.domestic.<a href="./src/resources/payments/domestic.ts">executeRtp</a>({ ...params }) -> void</code>
- <code title="post /payments/domestic/wire">client.payments.domestic.<a href="./src/resources/payments/domestic.ts">executeWire</a>({ ...params }) -> void</code>

## International

Types:

- <code><a href="./src/resources/payments/international.ts">InternationalGetStatusResponse</a></code>

Methods:

- <code title="post /payments/international/sepa">client.payments.international.<a href="./src/resources/payments/international.ts">executeSepa</a>({ ...params }) -> void</code>
- <code title="post /payments/international/swift">client.payments.international.<a href="./src/resources/payments/international.ts">executeSwift</a>({ ...params }) -> void</code>
- <code title="get /payments/international/{paymentId}/status">client.payments.international.<a href="./src/resources/payments/international.ts">getStatus</a>(paymentID) -> InternationalGetStatusResponse</code>

## Fx

Types:

- <code><a href="./src/resources/payments/fx.ts">FxGetRatesResponse</a></code>

Methods:

- <code title="post /payments/fx/deals">client.payments.fx.<a href="./src/resources/payments/fx.ts">bookDeal</a>({ ...params }) -> void</code>
- <code title="post /payments/fx/convert">client.payments.fx.<a href="./src/resources/payments/fx.ts">executeConversion</a>({ ...params }) -> void</code>
- <code title="get /payments/fx/rates">client.payments.fx.<a href="./src/resources/payments/fx.ts">getRates</a>({ ...params }) -> FxGetRatesResponse</code>

# Sustainability

Types:

- <code><a href="./src/resources/sustainability/sustainability.ts">SustainabilityRetrieveCarbonFootprintResponse</a></code>

Methods:

- <code title="get /sustainability/carbon-footprint">client.sustainability.<a href="./src/resources/sustainability/sustainability.ts">retrieveCarbonFootprint</a>() -> SustainabilityRetrieveCarbonFootprintResponse</code>

## Offsets

Methods:

- <code title="post /sustainability/offsets/purchase">client.sustainability.offsets.<a href="./src/resources/sustainability/offsets.ts">purchaseCredits</a>({ ...params }) -> void</code>
- <code title="post /sustainability/offsets/retire">client.sustainability.offsets.<a href="./src/resources/sustainability/offsets.ts">retireCredits</a>({ ...params }) -> void</code>

## Impact

Types:

- <code><a href="./src/resources/sustainability/impact.ts">ImpactListGlobalGreenProjectsResponse</a></code>
- <code><a href="./src/resources/sustainability/impact.ts">ImpactRetrievePortfolioImpactResponse</a></code>

Methods:

- <code title="get /sustainability/impact/projects">client.sustainability.impact.<a href="./src/resources/sustainability/impact.ts">listGlobalGreenProjects</a>({ ...params }) -> ImpactListGlobalGreenProjectsResponse</code>
- <code title="get /sustainability/impact/portfolio">client.sustainability.impact.<a href="./src/resources/sustainability/impact.ts">retrievePortfolioImpact</a>() -> ImpactRetrievePortfolioImpactResponse</code>

# Marketplace

Types:

- <code><a href="./src/resources/marketplace/marketplace.ts">MarketplaceListProductsResponse</a></code>

Methods:

- <code title="get /marketplace/products">client.marketplace.<a href="./src/resources/marketplace/marketplace.ts">listProducts</a>() -> MarketplaceListProductsResponse</code>

## Offers

Types:

- <code><a href="./src/resources/marketplace/offers.ts">OfferListOffersResponse</a></code>

Methods:

- <code title="get /marketplace/offers">client.marketplace.offers.<a href="./src/resources/marketplace/offers.ts">listOffers</a>() -> OfferListOffersResponse</code>
- <code title="post /marketplace/offers/{offerId}/redeem">client.marketplace.offers.<a href="./src/resources/marketplace/offers.ts">redeemOffer</a>(offerID) -> void</code>

# Lending

## Applications

Types:

- <code><a href="./src/resources/lending/applications.ts">ApplicationSubmitResponse</a></code>
- <code><a href="./src/resources/lending/applications.ts">ApplicationTrackStatusResponse</a></code>

Methods:

- <code title="post /lending/applications">client.lending.applications.<a href="./src/resources/lending/applications.ts">submit</a>({ ...params }) -> ApplicationSubmitResponse</code>
- <code title="get /lending/applications/{appId}/status">client.lending.applications.<a href="./src/resources/lending/applications.ts">trackStatus</a>(appID) -> ApplicationTrackStatusResponse</code>

## Decisions

Types:

- <code><a href="./src/resources/lending/decisions.ts">DecisionGetRationaleResponse</a></code>

Methods:

- <code title="get /lending/decisions/{decisionId}/rationale">client.lending.decisions.<a href="./src/resources/lending/decisions.ts">getRationale</a>(decisionID) -> DecisionGetRationaleResponse</code>

# Investments

## Portfolios

Types:

- <code><a href="./src/resources/investments/portfolios.ts">PortfolioListResponse</a></code>
- <code><a href="./src/resources/investments/portfolios.ts">PortfolioRebalanceResponse</a></code>

Methods:

- <code title="post /investments/portfolios">client.investments.portfolios.<a href="./src/resources/investments/portfolios.ts">create</a>({ ...params }) -> void</code>
- <code title="get /investments/portfolios/{portfolioId}">client.investments.portfolios.<a href="./src/resources/investments/portfolios.ts">retrieve</a>(portfolioID) -> void</code>
- <code title="put /investments/portfolios/{portfolioId}">client.investments.portfolios.<a href="./src/resources/investments/portfolios.ts">update</a>(portfolioID, { ...params }) -> void</code>
- <code title="get /investments/portfolios">client.investments.portfolios.<a href="./src/resources/investments/portfolios.ts">list</a>({ ...params }) -> PortfolioListResponse</code>
- <code title="post /investments/portfolios/{portfolioId}/rebalance">client.investments.portfolios.<a href="./src/resources/investments/portfolios.ts">rebalance</a>(portfolioID, { ...params }) -> PortfolioRebalanceResponse</code>

## Assets

Types:

- <code><a href="./src/resources/investments/assets.ts">AssetSearchResponse</a></code>

Methods:

- <code title="get /investments/assets/search">client.investments.assets.<a href="./src/resources/investments/assets.ts">search</a>({ ...params }) -> AssetSearchResponse</code>

## Performance

Types:

- <code><a href="./src/resources/investments/performance.ts">PerformanceGetHistoricalResponse</a></code>

Methods:

- <code title="get /investments/performance/historical">client.investments.performance.<a href="./src/resources/investments/performance.ts">getHistorical</a>({ ...params }) -> PerformanceGetHistoricalResponse</code>

# System

Types:

- <code><a href="./src/resources/system/system.ts">SystemGetAuditLogsResponse</a></code>
- <code><a href="./src/resources/system/system.ts">SystemGetStatusResponse</a></code>

Methods:

- <code title="get /system/audit-logs">client.system.<a href="./src/resources/system/system.ts">getAuditLogs</a>({ ...params }) -> SystemGetAuditLogsResponse</code>
- <code title="get /system/status">client.system.<a href="./src/resources/system/system.ts">getStatus</a>() -> SystemGetStatusResponse</code>

## Webhooks

Types:

- <code><a href="./src/resources/system/webhooks.ts">WebhookListResponse</a></code>

Methods:

- <code title="get /system/webhooks">client.system.webhooks.<a href="./src/resources/system/webhooks.ts">list</a>() -> WebhookListResponse</code>
- <code title="delete /system/webhooks/{webhookId}">client.system.webhooks.<a href="./src/resources/system/webhooks.ts">delete</a>(webhookID) -> void</code>
- <code title="post /system/webhooks">client.system.webhooks.<a href="./src/resources/system/webhooks.ts">register</a>({ ...params }) -> void</code>

## Sandbox

Types:

- <code><a href="./src/resources/system/sandbox.ts">SandboxSimulateErrorResponse</a></code>

Methods:

- <code title="post /system/sandbox/reset">client.system.sandbox.<a href="./src/resources/system/sandbox.ts">reset</a>() -> void</code>
- <code title="post /system/sandbox/simulate-error">client.system.sandbox.<a href="./src/resources/system/sandbox.ts">simulateError</a>({ ...params }) -> SandboxSimulateErrorResponse</code>

## Verification

Methods:

- <code title="post /system/verification/biometric-comparison">client.system.verification.<a href="./src/resources/system/verification.ts">compareBiometric</a>({ ...params }) -> void</code>
- <code title="post /system/verification/document">client.system.verification.<a href="./src/resources/system/verification.ts">verifyDocument</a>() -> void</code>

## Notifications

Types:

- <code><a href="./src/resources/system/notifications.ts">NotificationListTemplatesResponse</a></code>

Methods:

- <code title="get /system/notifications/templates">client.system.notifications.<a href="./src/resources/system/notifications.ts">listTemplates</a>() -> NotificationListTemplatesResponse</code>
- <code title="post /system/notifications/push">client.system.notifications.<a href="./src/resources/system/notifications.ts">sendPush</a>({ ...params }) -> void</code>


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-go | ORIGINAL PATH: diplomat-bit-jocall3-go-7054919/api.md
================================================================================

# Users

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserLoginResponse">UserLoginResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserRegisterResponse">UserRegisterResponse</a>

Methods:

- <code title="post /users/login">client.Users.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserService.Login">Login</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserLoginParams">UserLoginParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserLoginResponse">UserLoginResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="post /users/register">client.Users.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserService.Register">Register</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserRegisterParams">UserRegisterParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserRegisterResponse">UserRegisterResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## Me

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeGetResponse">UserMeGetResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeUpdateResponse">UserMeUpdateResponse</a>

Methods:

- <code title="get /users/me">client.Users.Me.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeService.Get">Get</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeGetResponse">UserMeGetResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="put /users/me">client.Users.Me.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeService.Update">Update</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeUpdateParams">UserMeUpdateParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeUpdateResponse">UserMeUpdateResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

### Security

### Devices

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeDeviceListResponse">UserMeDeviceListResponse</a>

Methods:

- <code title="get /users/me/devices">client.Users.Me.Devices.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeDeviceService.List">List</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeDeviceListParams">UserMeDeviceListParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeDeviceListResponse">UserMeDeviceListResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

### Biometrics

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeBiometricGetStatusResponse">UserMeBiometricGetStatusResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeBiometricVerifyResponse">UserMeBiometricVerifyResponse</a>

Methods:

- <code title="get /users/me/biometrics">client.Users.Me.Biometrics.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeBiometricService.GetStatus">GetStatus</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeBiometricGetStatusResponse">UserMeBiometricGetStatusResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="post /users/me/biometrics/verify">client.Users.Me.Biometrics.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeBiometricService.Verify">Verify</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeBiometricVerifyParams">UserMeBiometricVerifyParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#UserMeBiometricVerifyResponse">UserMeBiometricVerifyResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

# Accounts

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountGetResponse">AccountGetResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountListResponse">AccountListResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountLinkResponse">AccountLinkResponse</a>

Methods:

- <code title="get /accounts/{accountId}/details">client.Accounts.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountService.Get">Get</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, accountID <a href="https://pkg.go.dev/builtin#string">string</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountGetResponse">AccountGetResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="get /accounts/me">client.Accounts.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountService.List">List</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountListParams">AccountListParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountListResponse">AccountListResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="post /accounts/link">client.Accounts.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountService.Link">Link</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountLinkParams">AccountLinkParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountLinkResponse">AccountLinkResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## Transactions

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountTransactionListPendingResponse">AccountTransactionListPendingResponse</a>

Methods:

- <code title="get /accounts/{accountId}/transactions/pending">client.Accounts.Transactions.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountTransactionService.ListPending">ListPending</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, accountID <a href="https://pkg.go.dev/builtin#string">string</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountTransactionListPendingParams">AccountTransactionListPendingParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountTransactionListPendingResponse">AccountTransactionListPendingResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## Statements

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountStatementListResponse">AccountStatementListResponse</a>

Methods:

- <code title="get /accounts/{accountId}/statements">client.Accounts.Statements.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountStatementService.List">List</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, accountID <a href="https://pkg.go.dev/builtin#string">string</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountStatementListParams">AccountStatementListParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountStatementListResponse">AccountStatementListResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## Overdraft

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountOverdraftUpdateResponse">AccountOverdraftUpdateResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountOverdraftGetResponse">AccountOverdraftGetResponse</a>

Methods:

- <code title="put /accounts/{accountId}/overdraft-settings">client.Accounts.Overdraft.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountOverdraftService.Update">Update</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, accountID <a href="https://pkg.go.dev/builtin#string">string</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountOverdraftUpdateParams">AccountOverdraftUpdateParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountOverdraftUpdateResponse">AccountOverdraftUpdateResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="get /accounts/{accountId}/overdraft-settings">client.Accounts.Overdraft.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountOverdraftService.Get">Get</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, accountID <a href="https://pkg.go.dev/builtin#string">string</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AccountOverdraftGetResponse">AccountOverdraftGetResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

# Transactions

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionGetResponse">TransactionGetResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionListResponse">TransactionListResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionCategorizeResponse">TransactionCategorizeResponse</a>

Methods:

- <code title="get /transactions/{transactionId}">client.Transactions.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionService.Get">Get</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, transactionID <a href="https://pkg.go.dev/builtin#string">string</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionGetResponse">TransactionGetResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="get /transactions">client.Transactions.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionService.List">List</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionListParams">TransactionListParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionListResponse">TransactionListResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="put /transactions/{transactionId}/categorize">client.Transactions.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionService.Categorize">Categorize</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, transactionID <a href="https://pkg.go.dev/builtin#string">string</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionCategorizeParams">TransactionCategorizeParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionCategorizeResponse">TransactionCategorizeResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## Recurring

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionRecurringListResponse">TransactionRecurringListResponse</a>

Methods:

- <code title="get /transactions/recurring">client.Transactions.Recurring.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionRecurringService.List">List</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionRecurringListParams">TransactionRecurringListParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionRecurringListResponse">TransactionRecurringListResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## Insights

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionInsightGetTrendsResponse">TransactionInsightGetTrendsResponse</a>

Methods:

- <code title="get /transactions/insights/spending-trends">client.Transactions.Insights.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionInsightService.GetTrends">GetTrends</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#TransactionInsightGetTrendsResponse">TransactionInsightGetTrendsResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

# AI

## Advisor

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIAdvisorChatResponse">AIAdvisorChatResponse</a>

Methods:

- <code title="post /ai/advisor/chat">client.AI.Advisor.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIAdvisorService.Chat">Chat</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIAdvisorChatParams">AIAdvisorChatParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIAdvisorChatResponse">AIAdvisorChatResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

### Tools

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIAdvisorToolListResponse">AIAdvisorToolListResponse</a>

Methods:

- <code title="get /ai/advisor/tools">client.AI.Advisor.Tools.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIAdvisorToolService.List">List</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIAdvisorToolListParams">AIAdvisorToolListParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIAdvisorToolListResponse">AIAdvisorToolListResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## Oracle

### Simulate

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIOracleSimulateRunAdvancedResponse">AIOracleSimulateRunAdvancedResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIOracleSimulateRunStandardResponse">AIOracleSimulateRunStandardResponse</a>

Methods:

- <code title="post /ai/oracle/simulate/advanced">client.AI.Oracle.Simulate.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIOracleSimulateService.RunAdvanced">RunAdvanced</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIOracleSimulateRunAdvancedParams">AIOracleSimulateRunAdvancedParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIOracleSimulateRunAdvancedResponse">AIOracleSimulateRunAdvancedResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="post /ai/oracle/simulate">client.AI.Oracle.Simulate.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIOracleSimulateService.RunStandard">RunStandard</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIOracleSimulateRunStandardParams">AIOracleSimulateRunStandardParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIOracleSimulateRunStandardResponse">AIOracleSimulateRunStandardResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

### Predictions

## Incubator

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIIncubatorGeneratePitchResponse">AIIncubatorGeneratePitchResponse</a>

Methods:

- <code title="post /ai/incubator/pitch">client.AI.Incubator.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIIncubatorService.GeneratePitch">GeneratePitch</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIIncubatorGeneratePitchParams">AIIncubatorGeneratePitchParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#AIIncubatorGeneratePitchResponse">AIIncubatorGeneratePitchResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

### Analysis

## Ads

# Corporate

## Compliance

### Audits

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateComplianceAuditRequestResponse">CorporateComplianceAuditRequestResponse</a>

Methods:

- <code title="post /corporate/compliance/audits">client.Corporate.Compliance.Audits.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateComplianceAuditService.Request">Request</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateComplianceAuditRequestParams">CorporateComplianceAuditRequestParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateComplianceAuditRequestResponse">CorporateComplianceAuditRequestResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## Treasury

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateTreasuryForecastCashFlowResponse">CorporateTreasuryForecastCashFlowResponse</a>

Methods:

- <code title="get /corporate/treasury/cash-flow/forecast">client.Corporate.Treasury.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateTreasuryService.ForecastCashFlow">ForecastCashFlow</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateTreasuryForecastCashFlowParams">CorporateTreasuryForecastCashFlowParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateTreasuryForecastCashFlowResponse">CorporateTreasuryForecastCashFlowResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

### Sweeping

## Cards

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardListResponse">CorporateCardListResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardFreezeResponse">CorporateCardFreezeResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardIssueVirtualResponse">CorporateCardIssueVirtualResponse</a>

Methods:

- <code title="get /corporate/cards">client.Corporate.Cards.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardService.List">List</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardListParams">CorporateCardListParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardListResponse">CorporateCardListResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="post /corporate/cards/{cardId}/freeze">client.Corporate.Cards.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardService.Freeze">Freeze</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, cardID <a href="https://pkg.go.dev/builtin#string">string</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardFreezeParams">CorporateCardFreezeParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardFreezeResponse">CorporateCardFreezeResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="post /corporate/cards/virtual">client.Corporate.Cards.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardService.IssueVirtual">IssueVirtual</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardIssueVirtualParams">CorporateCardIssueVirtualParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardIssueVirtualResponse">CorporateCardIssueVirtualResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

### Controls

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardControlUpdateResponse">CorporateCardControlUpdateResponse</a>

Methods:

- <code title="put /corporate/cards/{cardId}/controls">client.Corporate.Cards.Controls.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardControlService.Update">Update</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, cardID <a href="https://pkg.go.dev/builtin#string">string</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardControlUpdateParams">CorporateCardControlUpdateParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateCardControlUpdateResponse">CorporateCardControlUpdateResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## Risk

### Fraud

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateRiskFraudListRulesResponse">CorporateRiskFraudListRulesResponse</a>

Methods:

- <code title="get /corporate/risk/fraud/rules">client.Corporate.Risk.Fraud.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateRiskFraudService.ListRules">ListRules</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateRiskFraudListRulesParams">CorporateRiskFraudListRulesParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#CorporateRiskFraudListRulesResponse">CorporateRiskFraudListRulesResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

# Web3

## Wallets

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3WalletNewResponse">Web3WalletNewResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3WalletListResponse">Web3WalletListResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3WalletGetBalanceResponse">Web3WalletGetBalanceResponse</a>

Methods:

- <code title="post /web3/wallets">client.Web3.Wallets.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3WalletService.New">New</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3WalletNewParams">Web3WalletNewParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3WalletNewResponse">Web3WalletNewResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="get /web3/wallets">client.Web3.Wallets.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3WalletService.List">List</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3WalletListParams">Web3WalletListParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3WalletListResponse">Web3WalletListResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="get /web3/wallets/{walletId}/balances">client.Web3.Wallets.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3WalletService.GetBalance">GetBalance</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, walletID <a href="https://pkg.go.dev/builtin#string">string</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3WalletGetBalanceParams">Web3WalletGetBalanceParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3WalletGetBalanceResponse">Web3WalletGetBalanceResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## Transactions

## NFTs

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3NFTListResponse">Web3NFTListResponse</a>

Methods:

- <code title="get /web3/nfts">client.Web3.NFTs.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3NFTService.List">List</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3NFTListParams">Web3NFTListParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#Web3NFTListResponse">Web3NFTListResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## SmartContracts

# Payments

## Domestic

## International

## Fx

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#PaymentFxConvertResponse">PaymentFxConvertResponse</a>
- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#PaymentFxGetRatesResponse">PaymentFxGetRatesResponse</a>

Methods:

- <code title="post /payments/fx/convert">client.Payments.Fx.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#PaymentFxService.Convert">Convert</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#PaymentFxConvertParams">PaymentFxConvertParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#PaymentFxConvertResponse">PaymentFxConvertResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>
- <code title="get /payments/fx/rates">client.Payments.Fx.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#PaymentFxService.GetRates">GetRates</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#PaymentFxGetRatesParams">PaymentFxGetRatesParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#PaymentFxGetRatesResponse">PaymentFxGetRatesResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

# Sustainability

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#SustainabilityGetFootprintResponse">SustainabilityGetFootprintResponse</a>

Methods:

- <code title="get /sustainability/carbon-footprint">client.Sustainability.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#SustainabilityService.GetFootprint">GetFootprint</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#SustainabilityGetFootprintResponse">SustainabilityGetFootprintResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## Offsets

## Impact

# Marketplace

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#MarketplaceListProductsResponse">MarketplaceListProductsResponse</a>

Methods:

- <code title="get /marketplace/products">client.Marketplace.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#MarketplaceService.ListProducts">ListProducts</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, query <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#MarketplaceListProductsParams">MarketplaceListProductsParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#MarketplaceListProductsResponse">MarketplaceListProductsResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

## Offers

Response Types:

- <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#MarketplaceOfferRedeemResponse">MarketplaceOfferRedeemResponse</a>

Methods:

- <code title="post /marketplace/offers/{offerId}/redeem">client.Marketplace.Offers.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#MarketplaceOfferService.Redeem">Redeem</a>(ctx <a href="https://pkg.go.dev/context">context</a>.<a href="https://pkg.go.dev/context#Context">Context</a>, offerID <a href="https://pkg.go.dev/builtin#string">string</a>, body <a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#MarketplaceOfferRedeemParams">MarketplaceOfferRedeemParams</a>) (\*<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go">githubcomjocall3go</a>.<a href="https://pkg.go.dev/github.com/diplomat-bit/jocall3-go#MarketplaceOfferRedeemResponse">MarketplaceOfferRedeemResponse</a>, <a href="https://pkg.go.dev/builtin#error">error</a>)</code>

# Lending

## Decisions


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/api.md
================================================================================

# Users

Types:

- <code><a href="./src/resources/users/users.ts">UserLoginResponse</a></code>
- <code><a href="./src/resources/users/users.ts">UserRegisterResponse</a></code>

Methods:

- <code title="post /users/login">client.users.<a href="./src/resources/users/users.ts">login</a>() -> unknown</code>
- <code title="post /users/register">client.users.<a href="./src/resources/users/users.ts">register</a>({ ...params }) -> UserRegisterResponse</code>

## Me

Types:

- <code><a href="./src/resources/users/me/me.ts">MeRetrieveResponse</a></code>
- <code><a href="./src/resources/users/me/me.ts">MeUpdateResponse</a></code>

Methods:

- <code title="get /users/me">client.users.me.<a href="./src/resources/users/me/me.ts">retrieve</a>() -> MeRetrieveResponse</code>
- <code title="put /users/me">client.users.me.<a href="./src/resources/users/me/me.ts">update</a>({ ...params }) -> MeUpdateResponse</code>

### Security

### Devices

Types:

- <code><a href="./src/resources/users/me/devices.ts">DeviceListResponse</a></code>

Methods:

- <code title="get /users/me/devices">client.users.me.devices.<a href="./src/resources/users/me/devices.ts">list</a>({ ...params }) -> unknown</code>

### Biometrics

Types:

- <code><a href="./src/resources/users/me/biometrics.ts">BiometricRetrieveStatusResponse</a></code>
- <code><a href="./src/resources/users/me/biometrics.ts">BiometricVerifyResponse</a></code>

Methods:

- <code title="get /users/me/biometrics">client.users.me.biometrics.<a href="./src/resources/users/me/biometrics.ts">retrieveStatus</a>() -> unknown</code>
- <code title="post /users/me/biometrics/verify">client.users.me.biometrics.<a href="./src/resources/users/me/biometrics.ts">verify</a>() -> unknown</code>

# Accounts

Types:

- <code><a href="./src/resources/accounts/accounts.ts">AccountRetrieveResponse</a></code>
- <code><a href="./src/resources/accounts/accounts.ts">AccountListResponse</a></code>
- <code><a href="./src/resources/accounts/accounts.ts">AccountLinkResponse</a></code>

Methods:

- <code title="get /accounts/{accountId}/details">client.accounts.<a href="./src/resources/accounts/accounts.ts">retrieve</a>(accountId) -> AccountRetrieveResponse</code>
- <code title="get /accounts/me">client.accounts.<a href="./src/resources/accounts/accounts.ts">list</a>({ ...params }) -> unknown</code>
- <code title="post /accounts/link">client.accounts.<a href="./src/resources/accounts/accounts.ts">link</a>() -> unknown</code>

## Transactions

Types:

- <code><a href="./src/resources/accounts/transactions.ts">TransactionListPendingResponse</a></code>

Methods:

- <code title="get /accounts/{accountId}/transactions/pending">client.accounts.transactions.<a href="./src/resources/accounts/transactions.ts">listPending</a>(accountId, { ...params }) -> unknown</code>

## Statements

Types:

- <code><a href="./src/resources/accounts/statements.ts">StatementListResponse</a></code>

Methods:

- <code title="get /accounts/{accountId}/statements">client.accounts.statements.<a href="./src/resources/accounts/statements.ts">list</a>(accountId, { ...params }) -> StatementListResponse</code>

## Overdraft

Types:

- <code><a href="./src/resources/accounts/overdraft.ts">OverdraftUpdateResponse</a></code>
- <code><a href="./src/resources/accounts/overdraft.ts">OverdraftGetResponse</a></code>

Methods:

- <code title="put /accounts/{accountId}/overdraft-settings">client.accounts.overdraft.<a href="./src/resources/accounts/overdraft.ts">update</a>(accountId) -> unknown</code>
- <code title="get /accounts/{accountId}/overdraft-settings">client.accounts.overdraft.<a href="./src/resources/accounts/overdraft.ts">get</a>(accountId) -> unknown</code>

# Transactions

Types:

- <code><a href="./src/resources/transactions/transactions.ts">TransactionRetrieveResponse</a></code>
- <code><a href="./src/resources/transactions/transactions.ts">TransactionListResponse</a></code>
- <code><a href="./src/resources/transactions/transactions.ts">TransactionCategorizeResponse</a></code>

Methods:

- <code title="get /transactions/{transactionId}">client.transactions.<a href="./src/resources/transactions/transactions.ts">retrieve</a>(transactionId) -> TransactionRetrieveResponse</code>
- <code title="get /transactions">client.transactions.<a href="./src/resources/transactions/transactions.ts">list</a>({ ...params }) -> unknown</code>
- <code title="put /transactions/{transactionId}/categorize">client.transactions.<a href="./src/resources/transactions/transactions.ts">categorize</a>(transactionId) -> TransactionCategorizeResponse</code>

## Recurring

Types:

- <code><a href="./src/resources/transactions/recurring.ts">RecurringListResponse</a></code>

Methods:

- <code title="get /transactions/recurring">client.transactions.recurring.<a href="./src/resources/transactions/recurring.ts">list</a>({ ...params }) -> unknown</code>

## Insights

Types:

- <code><a href="./src/resources/transactions/insights.ts">InsightGetTrendsResponse</a></code>

Methods:

- <code title="get /transactions/insights/spending-trends">client.transactions.insights.<a href="./src/resources/transactions/insights.ts">getTrends</a>() -> unknown</code>

# AI

## Advisor

Types:

- <code><a href="./src/resources/ai/advisor/advisor.ts">AdvisorChatResponse</a></code>

Methods:

- <code title="post /ai/advisor/chat">client.ai.advisor.<a href="./src/resources/ai/advisor/advisor.ts">chat</a>({ ...params }) -> unknown</code>

### Tools

Types:

- <code><a href="./src/resources/ai/advisor/tools.ts">ToolListResponse</a></code>

Methods:

- <code title="get /ai/advisor/tools">client.ai.advisor.tools.<a href="./src/resources/ai/advisor/tools.ts">list</a>({ ...params }) -> unknown</code>

## Oracle

### Simulate

Types:

- <code><a href="./src/resources/ai/oracle/simulate.ts">SimulateRunAdvancedResponse</a></code>
- <code><a href="./src/resources/ai/oracle/simulate.ts">SimulateRunStandardResponse</a></code>

Methods:

- <code title="post /ai/oracle/simulate/advanced">client.ai.oracle.simulate.<a href="./src/resources/ai/oracle/simulate.ts">runAdvanced</a>({ ...params }) -> unknown</code>
- <code title="post /ai/oracle/simulate">client.ai.oracle.simulate.<a href="./src/resources/ai/oracle/simulate.ts">runStandard</a>() -> SimulateRunStandardResponse</code>

### Predictions

## Incubator

Types:

- <code><a href="./src/resources/ai/incubator/incubator.ts">IncubatorGeneratePitchResponse</a></code>

Methods:

- <code title="post /ai/incubator/pitch">client.ai.incubator.<a href="./src/resources/ai/incubator/incubator.ts">generatePitch</a>({ ...params }) -> unknown</code>

### Analysis

## Ads

# Corporate

## Compliance

### Audits

Types:

- <code><a href="./src/resources/corporate/compliance/audits.ts">AuditRequestResponse</a></code>

Methods:

- <code title="post /corporate/compliance/audits">client.corporate.compliance.audits.<a href="./src/resources/corporate/compliance/audits.ts">request</a>() -> unknown</code>

## Treasury

Types:

- <code><a href="./src/resources/corporate/treasury/treasury.ts">TreasuryForecastCashFlowResponse</a></code>

Methods:

- <code title="get /corporate/treasury/cash-flow/forecast">client.corporate.treasury.<a href="./src/resources/corporate/treasury/treasury.ts">forecastCashFlow</a>({ ...params }) -> TreasuryForecastCashFlowResponse</code>

### Sweeping

## Cards

Types:

- <code><a href="./src/resources/corporate/cards/cards.ts">CardListResponse</a></code>
- <code><a href="./src/resources/corporate/cards/cards.ts">CardFreezeResponse</a></code>
- <code><a href="./src/resources/corporate/cards/cards.ts">CardIssueVirtualResponse</a></code>

Methods:

- <code title="get /corporate/cards">client.corporate.cards.<a href="./src/resources/corporate/cards/cards.ts">list</a>({ ...params }) -> unknown</code>
- <code title="post /corporate/cards/{cardId}/freeze">client.corporate.cards.<a href="./src/resources/corporate/cards/cards.ts">freeze</a>(cardId) -> CardFreezeResponse</code>
- <code title="post /corporate/cards/virtual">client.corporate.cards.<a href="./src/resources/corporate/cards/cards.ts">issueVirtual</a>({ ...params }) -> CardIssueVirtualResponse</code>

### Controls

Types:

- <code><a href="./src/resources/corporate/cards/controls.ts">ControlUpdateResponse</a></code>

Methods:

- <code title="put /corporate/cards/{cardId}/controls">client.corporate.cards.controls.<a href="./src/resources/corporate/cards/controls.ts">update</a>(cardId) -> ControlUpdateResponse</code>

## Risk

### Fraud

Types:

- <code><a href="./src/resources/corporate/risk/fraud.ts">FraudListRulesResponse</a></code>

Methods:

- <code title="get /corporate/risk/fraud/rules">client.corporate.risk.fraud.<a href="./src/resources/corporate/risk/fraud.ts">listRules</a>({ ...params }) -> unknown</code>

# Web3

## Wallets

Types:

- <code><a href="./src/resources/web3/wallets.ts">WalletCreateResponse</a></code>
- <code><a href="./src/resources/web3/wallets.ts">WalletListResponse</a></code>
- <code><a href="./src/resources/web3/wallets.ts">WalletGetBalanceResponse</a></code>

Methods:

- <code title="post /web3/wallets">client.web3.wallets.<a href="./src/resources/web3/wallets.ts">create</a>() -> unknown</code>
- <code title="get /web3/wallets">client.web3.wallets.<a href="./src/resources/web3/wallets.ts">list</a>({ ...params }) -> unknown</code>
- <code title="get /web3/wallets/{walletId}/balances">client.web3.wallets.<a href="./src/resources/web3/wallets.ts">getBalance</a>(walletId, { ...params }) -> unknown</code>

## Transactions

## NFTs

Types:

- <code><a href="./src/resources/web3/nfts.ts">NFTListResponse</a></code>

Methods:

- <code title="get /web3/nfts">client.web3.nfts.<a href="./src/resources/web3/nfts.ts">list</a>({ ...params }) -> unknown</code>

## SmartContracts

# Payments

## Domestic

## International

## Fx

Types:

- <code><a href="./src/resources/payments/fx.ts">FxConvertResponse</a></code>
- <code><a href="./src/resources/payments/fx.ts">FxGetRatesResponse</a></code>

Methods:

- <code title="post /payments/fx/convert">client.payments.fx.<a href="./src/resources/payments/fx.ts">convert</a>() -> unknown</code>
- <code title="get /payments/fx/rates">client.payments.fx.<a href="./src/resources/payments/fx.ts">getRates</a>({ ...params }) -> FxGetRatesResponse</code>

# Sustainability

Types:

- <code><a href="./src/resources/sustainability/sustainability.ts">SustainabilityGetFootprintResponse</a></code>

Methods:

- <code title="get /sustainability/carbon-footprint">client.sustainability.<a href="./src/resources/sustainability/sustainability.ts">getFootprint</a>() -> unknown</code>

## Offsets

## Impact

# Marketplace

Types:

- <code><a href="./src/resources/marketplace/marketplace.ts">MarketplaceListProductsResponse</a></code>

Methods:

- <code title="get /marketplace/products">client.marketplace.<a href="./src/resources/marketplace/marketplace.ts">listProducts</a>({ ...params }) -> unknown</code>

## Offers

Types:

- <code><a href="./src/resources/marketplace/offers.ts">OfferRedeemResponse</a></code>

Methods:

- <code title="post /marketplace/offers/{offerId}/redeem">client.marketplace.offers.<a href="./src/resources/marketplace/offers.ts">redeem</a>(offerId) -> unknown</code>

# Lending

## Decisions


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-python | ORIGINAL PATH: diplomat-bit-jocall3-python-03825e0/api.md
================================================================================

# Users

Types:

```python
from jocall3.types import UserLoginResponse, UserRegisterResponse
```

Methods:

- <code title="post /users/login">client.users.<a href="./src/jocall3/resources/users/users.py">login</a>(\*\*<a href="src/jocall3/types/user_login_params.py">params</a>) -> <a href="./src/jocall3/types/user_login_response.py">UserLoginResponse</a></code>
- <code title="post /users/register">client.users.<a href="./src/jocall3/resources/users/users.py">register</a>(\*\*<a href="src/jocall3/types/user_register_params.py">params</a>) -> <a href="./src/jocall3/types/user_register_response.py">UserRegisterResponse</a></code>

## PasswordReset

Types:

```python
from jocall3.types.users import PasswordResetConfirmResponse, PasswordResetInitiateResponse
```

Methods:

- <code title="post /users/password-reset/confirm">client.users.password_reset.<a href="./src/jocall3/resources/users/password_reset.py">confirm</a>(\*\*<a href="src/jocall3/types/users/password_reset_confirm_params.py">params</a>) -> <a href="./src/jocall3/types/users/password_reset_confirm_response.py">PasswordResetConfirmResponse</a></code>
- <code title="post /users/password-reset/initiate">client.users.password_reset.<a href="./src/jocall3/resources/users/password_reset.py">initiate</a>(\*\*<a href="src/jocall3/types/users/password_reset_initiate_params.py">params</a>) -> <a href="./src/jocall3/types/users/password_reset_initiate_response.py">PasswordResetInitiateResponse</a></code>

## Me

Types:

```python
from jocall3.types.users import MeRetrieveResponse, MeUpdateResponse, MeListDevicesResponse
```

Methods:

- <code title="get /users/me">client.users.me.<a href="./src/jocall3/resources/users/me/me.py">retrieve</a>() -> <a href="./src/jocall3/types/users/me_retrieve_response.py">MeRetrieveResponse</a></code>
- <code title="put /users/me">client.users.me.<a href="./src/jocall3/resources/users/me/me.py">update</a>(\*\*<a href="src/jocall3/types/users/me_update_params.py">params</a>) -> <a href="./src/jocall3/types/users/me_update_response.py">MeUpdateResponse</a></code>
- <code title="get /users/me/devices">client.users.me.<a href="./src/jocall3/resources/users/me/me.py">list_devices</a>(\*\*<a href="src/jocall3/types/users/me_list_devices_params.py">params</a>) -> <a href="./src/jocall3/types/users/me_list_devices_response.py">MeListDevicesResponse</a></code>

### Preferences

Types:

```python
from jocall3.types.users.me import PreferenceRetrieveResponse, PreferenceUpdateResponse
```

Methods:

- <code title="get /users/me/preferences">client.users.me.preferences.<a href="./src/jocall3/resources/users/me/preferences.py">retrieve</a>() -> <a href="./src/jocall3/types/users/me/preference_retrieve_response.py">PreferenceRetrieveResponse</a></code>
- <code title="put /users/me/preferences">client.users.me.preferences.<a href="./src/jocall3/resources/users/me/preferences.py">update</a>(\*\*<a href="src/jocall3/types/users/me/preference_update_params.py">params</a>) -> <a href="./src/jocall3/types/users/me/preference_update_response.py">PreferenceUpdateResponse</a></code>

### Biometrics

Types:

```python
from jocall3.types.users.me import BiometricRetrieveStatusResponse, BiometricVerifyResponse
```

Methods:

- <code title="get /users/me/biometrics">client.users.me.biometrics.<a href="./src/jocall3/resources/users/me/biometrics.py">retrieve_status</a>() -> <a href="./src/jocall3/types/users/me/biometric_retrieve_status_response.py">BiometricRetrieveStatusResponse</a></code>
- <code title="post /users/me/biometrics/verify">client.users.me.biometrics.<a href="./src/jocall3/resources/users/me/biometrics.py">verify</a>(\*\*<a href="src/jocall3/types/users/me/biometric_verify_params.py">params</a>) -> <a href="./src/jocall3/types/users/me/biometric_verify_response.py">BiometricVerifyResponse</a></code>

# Accounts

Types:

```python
from jocall3.types import (
    AccountLinkResponse,
    AccountRetrieveDetailsResponse,
    AccountRetrieveMeResponse,
    AccountRetrieveStatementsResponse,
)
```

Methods:

- <code title="post /accounts/link">client.accounts.<a href="./src/jocall3/resources/accounts/accounts.py">link</a>(\*\*<a href="src/jocall3/types/account_link_params.py">params</a>) -> <a href="./src/jocall3/types/account_link_response.py">AccountLinkResponse</a></code>
- <code title="get /accounts/{accountId}/details">client.accounts.<a href="./src/jocall3/resources/accounts/accounts.py">retrieve_details</a>(account_id) -> <a href="./src/jocall3/types/account_retrieve_details_response.py">AccountRetrieveDetailsResponse</a></code>
- <code title="get /accounts/me">client.accounts.<a href="./src/jocall3/resources/accounts/accounts.py">retrieve_me</a>(\*\*<a href="src/jocall3/types/account_retrieve_me_params.py">params</a>) -> <a href="./src/jocall3/types/account_retrieve_me_response.py">AccountRetrieveMeResponse</a></code>
- <code title="get /accounts/{accountId}/statements">client.accounts.<a href="./src/jocall3/resources/accounts/accounts.py">retrieve_statements</a>(account_id, \*\*<a href="src/jocall3/types/account_retrieve_statements_params.py">params</a>) -> <a href="./src/jocall3/types/account_retrieve_statements_response.py">AccountRetrieveStatementsResponse</a></code>

## Transactions

Types:

```python
from jocall3.types.accounts import TransactionRetrievePendingResponse
```

Methods:

- <code title="get /accounts/{accountId}/transactions/pending">client.accounts.transactions.<a href="./src/jocall3/resources/accounts/transactions.py">retrieve_pending</a>(account_id, \*\*<a href="src/jocall3/types/accounts/transaction_retrieve_pending_params.py">params</a>) -> <a href="./src/jocall3/types/accounts/transaction_retrieve_pending_response.py">TransactionRetrievePendingResponse</a></code>

## OverdraftSettings

Types:

```python
from jocall3.types.accounts import (
    OverdraftSettingRetrieveOverdraftSettingsResponse,
    OverdraftSettingUpdateOverdraftSettingsResponse,
)
```

Methods:

- <code title="get /accounts/{accountId}/overdraft-settings">client.accounts.overdraft_settings.<a href="./src/jocall3/resources/accounts/overdraft_settings.py">retrieve_overdraft_settings</a>(account_id) -> <a href="./src/jocall3/types/accounts/overdraft_setting_retrieve_overdraft_settings_response.py">OverdraftSettingRetrieveOverdraftSettingsResponse</a></code>
- <code title="put /accounts/{accountId}/overdraft-settings">client.accounts.overdraft_settings.<a href="./src/jocall3/resources/accounts/overdraft_settings.py">update_overdraft_settings</a>(account_id, \*\*<a href="src/jocall3/types/accounts/overdraft_setting_update_overdraft_settings_params.py">params</a>) -> <a href="./src/jocall3/types/accounts/overdraft_setting_update_overdraft_settings_response.py">OverdraftSettingUpdateOverdraftSettingsResponse</a></code>

# Transactions

Types:

```python
from jocall3.types import (
    TransactionRetrieveResponse,
    TransactionListResponse,
    TransactionCategorizeResponse,
    TransactionListRecurringResponse,
    TransactionUpdateNotesResponse,
)
```

Methods:

- <code title="get /transactions/{transactionId}">client.transactions.<a href="./src/jocall3/resources/transactions/transactions.py">retrieve</a>(transaction_id) -> <a href="./src/jocall3/types/transaction_retrieve_response.py">TransactionRetrieveResponse</a></code>
- <code title="get /transactions">client.transactions.<a href="./src/jocall3/resources/transactions/transactions.py">list</a>(\*\*<a href="src/jocall3/types/transaction_list_params.py">params</a>) -> <a href="./src/jocall3/types/transaction_list_response.py">TransactionListResponse</a></code>
- <code title="put /transactions/{transactionId}/categorize">client.transactions.<a href="./src/jocall3/resources/transactions/transactions.py">categorize</a>(transaction_id, \*\*<a href="src/jocall3/types/transaction_categorize_params.py">params</a>) -> <a href="./src/jocall3/types/transaction_categorize_response.py">TransactionCategorizeResponse</a></code>
- <code title="get /transactions/recurring">client.transactions.<a href="./src/jocall3/resources/transactions/transactions.py">list_recurring</a>(\*\*<a href="src/jocall3/types/transaction_list_recurring_params.py">params</a>) -> <a href="./src/jocall3/types/transaction_list_recurring_response.py">TransactionListRecurringResponse</a></code>
- <code title="put /transactions/{transactionId}/notes">client.transactions.<a href="./src/jocall3/resources/transactions/transactions.py">update_notes</a>(transaction_id, \*\*<a href="src/jocall3/types/transaction_update_notes_params.py">params</a>) -> <a href="./src/jocall3/types/transaction_update_notes_response.py">TransactionUpdateNotesResponse</a></code>

## Insights

Types:

```python
from jocall3.types.transactions import InsightGetSpendingTrendsResponse
```

Methods:

- <code title="get /transactions/insights/spending-trends">client.transactions.insights.<a href="./src/jocall3/resources/transactions/insights.py">get_spending_trends</a>() -> <a href="./src/jocall3/types/transactions/insight_get_spending_trends_response.py">InsightGetSpendingTrendsResponse</a></code>

# Budgets

Types:

```python
from jocall3.types import BudgetRetrieveResponse, BudgetUpdateResponse, BudgetListResponse
```

Methods:

- <code title="get /budgets/{budgetId}">client.budgets.<a href="./src/jocall3/resources/budgets.py">retrieve</a>(budget_id) -> <a href="./src/jocall3/types/budget_retrieve_response.py">BudgetRetrieveResponse</a></code>
- <code title="put /budgets/{budgetId}">client.budgets.<a href="./src/jocall3/resources/budgets.py">update</a>(budget_id, \*\*<a href="src/jocall3/types/budget_update_params.py">params</a>) -> <a href="./src/jocall3/types/budget_update_response.py">BudgetUpdateResponse</a></code>
- <code title="get /budgets">client.budgets.<a href="./src/jocall3/resources/budgets.py">list</a>(\*\*<a href="src/jocall3/types/budget_list_params.py">params</a>) -> <a href="./src/jocall3/types/budget_list_response.py">BudgetListResponse</a></code>

# Investments

## Portfolios

Methods:

- <code title="get /investments/portfolios/{portfolioId}">client.investments.portfolios.<a href="./src/jocall3/resources/investments/portfolios.py">retrieve</a>(portfolio_id) -> object</code>
- <code title="put /investments/portfolios/{portfolioId}">client.investments.portfolios.<a href="./src/jocall3/resources/investments/portfolios.py">update</a>(portfolio_id) -> object</code>
- <code title="get /investments/portfolios">client.investments.portfolios.<a href="./src/jocall3/resources/investments/portfolios.py">list</a>(\*\*<a href="src/jocall3/types/investments/portfolio_list_params.py">params</a>) -> object</code>
- <code title="post /investments/portfolios/{portfolioId}/rebalance">client.investments.portfolios.<a href="./src/jocall3/resources/investments/portfolios.py">rebalance</a>(portfolio_id) -> object</code>

## Assets

Methods:

- <code title="get /investments/assets/search">client.investments.assets.<a href="./src/jocall3/resources/investments/assets.py">search</a>(\*\*<a href="src/jocall3/types/investments/asset_search_params.py">params</a>) -> object</code>

# AI

## Advisor

Methods:

- <code title="get /ai/advisor/tools">client.ai.advisor.<a href="./src/jocall3/resources/ai/advisor/advisor.py">list_tools</a>(\*\*<a href="src/jocall3/types/ai/advisor_list_tools_params.py">params</a>) -> object</code>

### Chat

Methods:

- <code title="get /ai/advisor/chat/history">client.ai.advisor.chat.<a href="./src/jocall3/resources/ai/advisor/chat.py">retrieve_history</a>(\*\*<a href="src/jocall3/types/ai/advisor/chat_retrieve_history_params.py">params</a>) -> object</code>
- <code title="post /ai/advisor/chat">client.ai.advisor.chat.<a href="./src/jocall3/resources/ai/advisor/chat.py">send_message</a>(\*\*<a href="src/jocall3/types/ai/advisor/chat_send_message_params.py">params</a>) -> object</code>

## Oracle

### Simulate

Types:

```python
from jocall3.types.ai.oracle import SimulateRunStandardSimulationResponse
```

Methods:

- <code title="post /ai/oracle/simulate/advanced">client.ai.oracle.simulate.<a href="./src/jocall3/resources/ai/oracle/simulate.py">run_advanced_simulation</a>(\*\*<a href="src/jocall3/types/ai/oracle/simulate_run_advanced_simulation_params.py">params</a>) -> object</code>
- <code title="post /ai/oracle/simulate">client.ai.oracle.simulate.<a href="./src/jocall3/resources/ai/oracle/simulate.py">run_standard_simulation</a>() -> <a href="./src/jocall3/types/ai/oracle/simulate_run_standard_simulation_response.py">SimulateRunStandardSimulationResponse</a></code>

### Simulations

Types:

```python
from jocall3.types.ai.oracle import SimulationRetrieveResultsResponse
```

Methods:

- <code title="get /ai/oracle/simulations">client.ai.oracle.simulations.<a href="./src/jocall3/resources/ai/oracle/simulations.py">list_all</a>(\*\*<a href="src/jocall3/types/ai/oracle/simulation_list_all_params.py">params</a>) -> object</code>
- <code title="get /ai/oracle/simulations/{simulationId}">client.ai.oracle.simulations.<a href="./src/jocall3/resources/ai/oracle/simulations.py">retrieve_results</a>(simulation_id) -> <a href="./src/jocall3/types/ai/oracle/simulation_retrieve_results_response.py">SimulationRetrieveResultsResponse</a></code>

## Incubator

Methods:

- <code title="get /ai/incubator/pitches">client.ai.incubator.<a href="./src/jocall3/resources/ai/incubator/incubator.py">list_pitches</a>(\*\*<a href="src/jocall3/types/ai/incubator_list_pitches_params.py">params</a>) -> object</code>

### Pitch

Types:

```python
from jocall3.types.ai.incubator import PitchRetrieveAnalysisResponse
```

Methods:

- <code title="get /ai/incubator/pitch/{pitchId}/details">client.ai.incubator.pitch.<a href="./src/jocall3/resources/ai/incubator/pitch.py">retrieve_analysis</a>(pitch_id) -> <a href="./src/jocall3/types/ai/incubator/pitch_retrieve_analysis_response.py">PitchRetrieveAnalysisResponse</a></code>
- <code title="post /ai/incubator/pitch">client.ai.incubator.pitch.<a href="./src/jocall3/resources/ai/incubator/pitch.py">submit_business_plan</a>(\*\*<a href="src/jocall3/types/ai/incubator/pitch_submit_business_plan_params.py">params</a>) -> object</code>
- <code title="put /ai/incubator/pitch/{pitchId}/feedback">client.ai.incubator.pitch.<a href="./src/jocall3/resources/ai/incubator/pitch.py">submit_feedback</a>(pitch_id) -> object</code>

## Ads

Methods:

- <code title="post /ai/ads/generate">client.ai.ads.<a href="./src/jocall3/resources/ai/ads.py">generate_video_ad</a>() -> object</code>
- <code title="get /ai/ads/operations/{operationId}">client.ai.ads.<a href="./src/jocall3/resources/ai/ads.py">get_generation_status</a>(operation_id) -> object</code>
- <code title="get /ai/ads">client.ai.ads.<a href="./src/jocall3/resources/ai/ads.py">list_generated_ads</a>(\*\*<a href="src/jocall3/types/ai/ad_list_generated_ads_params.py">params</a>) -> object</code>

# Corporate

Methods:

- <code title="post /corporate/sanction-screening">client.corporate.<a href="./src/jocall3/resources/corporate/corporate.py">perform_sanction_screening</a>(\*\*<a href="src/jocall3/types/corporate_perform_sanction_screening_params.py">params</a>) -> object</code>

## Cards

Types:

```python
from jocall3.types.corporate import (
    CardCreateVirtualResponse,
    CardFreezeResponse,
    CardUpdateControlsResponse,
)
```

Methods:

- <code title="get /corporate/cards">client.corporate.cards.<a href="./src/jocall3/resources/corporate/cards.py">list</a>(\*\*<a href="src/jocall3/types/corporate/card_list_params.py">params</a>) -> object</code>
- <code title="post /corporate/cards/virtual">client.corporate.cards.<a href="./src/jocall3/resources/corporate/cards.py">create_virtual</a>(\*\*<a href="src/jocall3/types/corporate/card_create_virtual_params.py">params</a>) -> <a href="./src/jocall3/types/corporate/card_create_virtual_response.py">CardCreateVirtualResponse</a></code>
- <code title="post /corporate/cards/{cardId}/freeze">client.corporate.cards.<a href="./src/jocall3/resources/corporate/cards.py">freeze</a>(card_id) -> <a href="./src/jocall3/types/corporate/card_freeze_response.py">CardFreezeResponse</a></code>
- <code title="get /corporate/cards/{cardId}/transactions">client.corporate.cards.<a href="./src/jocall3/resources/corporate/cards.py">list_transactions</a>(card_id, \*\*<a href="src/jocall3/types/corporate/card_list_transactions_params.py">params</a>) -> object</code>
- <code title="put /corporate/cards/{cardId}/controls">client.corporate.cards.<a href="./src/jocall3/resources/corporate/cards.py">update_controls</a>(card_id) -> <a href="./src/jocall3/types/corporate/card_update_controls_response.py">CardUpdateControlsResponse</a></code>

## Anomalies

Methods:

- <code title="get /corporate/anomalies">client.corporate.anomalies.<a href="./src/jocall3/resources/corporate/anomalies.py">list</a>(\*\*<a href="src/jocall3/types/corporate/anomaly_list_params.py">params</a>) -> object</code>
- <code title="put /corporate/anomalies/{anomalyId}/status">client.corporate.anomalies.<a href="./src/jocall3/resources/corporate/anomalies.py">update_status</a>(anomaly_id) -> object</code>

## Compliance

### Audits

Types:

```python
from jocall3.types.corporate.compliance import AuditRetrieveReportResponse
```

Methods:

- <code title="post /corporate/compliance/audits">client.corporate.compliance.audits.<a href="./src/jocall3/resources/corporate/compliance/audits.py">request</a>() -> object</code>
- <code title="get /corporate/compliance/audits/{auditId}/report">client.corporate.compliance.audits.<a href="./src/jocall3/resources/corporate/compliance/audits.py">retrieve_report</a>(audit_id) -> <a href="./src/jocall3/types/corporate/compliance/audit_retrieve_report_response.py">AuditRetrieveReportResponse</a></code>

## Treasury

Types:

```python
from jocall3.types.corporate import TreasuryGetLiquidityPositionsResponse
```

Methods:

- <code title="get /corporate/treasury/liquidity-positions">client.corporate.treasury.<a href="./src/jocall3/resources/corporate/treasury/treasury.py">get_liquidity_positions</a>() -> <a href="./src/jocall3/types/corporate/treasury_get_liquidity_positions_response.py">TreasuryGetLiquidityPositionsResponse</a></code>

### CashFlow

Types:

```python
from jocall3.types.corporate.treasury import CashFlowForecastResponse
```

Methods:

- <code title="get /corporate/treasury/cash-flow/forecast">client.corporate.treasury.cash_flow.<a href="./src/jocall3/resources/corporate/treasury/cash_flow.py">forecast</a>(\*\*<a href="src/jocall3/types/corporate/treasury/cash_flow_forecast_params.py">params</a>) -> <a href="./src/jocall3/types/corporate/treasury/cash_flow_forecast_response.py">CashFlowForecastResponse</a></code>

## Risk

### Fraud

#### Rules

Types:

```python
from jocall3.types.corporate.risk.fraud import RuleUpdateResponse
```

Methods:

- <code title="put /corporate/risk/fraud/rules/{ruleId}">client.corporate.risk.fraud.rules.<a href="./src/jocall3/resources/corporate/risk/fraud/rules.py">update</a>(rule_id, \*\*<a href="src/jocall3/types/corporate/risk/fraud/rule_update_params.py">params</a>) -> <a href="./src/jocall3/types/corporate/risk/fraud/rule_update_response.py">RuleUpdateResponse</a></code>
- <code title="get /corporate/risk/fraud/rules">client.corporate.risk.fraud.rules.<a href="./src/jocall3/resources/corporate/risk/fraud/rules.py">list</a>(\*\*<a href="src/jocall3/types/corporate/risk/fraud/rule_list_params.py">params</a>) -> object</code>

# Web3

Methods:

- <code title="get /web3/nfts">client.web3.<a href="./src/jocall3/resources/web3/web3.py">retrieve_nfts</a>(\*\*<a href="src/jocall3/types/web3_retrieve_nfts_params.py">params</a>) -> object</code>

## Wallets

Methods:

- <code title="post /web3/wallets">client.web3.wallets.<a href="./src/jocall3/resources/web3/wallets.py">create</a>() -> object</code>
- <code title="get /web3/wallets">client.web3.wallets.<a href="./src/jocall3/resources/web3/wallets.py">list</a>(\*\*<a href="src/jocall3/types/web3/wallet_list_params.py">params</a>) -> object</code>
- <code title="get /web3/wallets/{walletId}/balances">client.web3.wallets.<a href="./src/jocall3/resources/web3/wallets.py">retrieve_balances</a>(wallet_id, \*\*<a href="src/jocall3/types/web3/wallet_retrieve_balances_params.py">params</a>) -> object</code>

## Transactions

Methods:

- <code title="post /web3/transactions/initiate">client.web3.transactions.<a href="./src/jocall3/resources/web3/transactions.py">initiate</a>() -> object</code>

# Payments

## International

Methods:

- <code title="get /payments/international/{paymentId}/status">client.payments.international.<a href="./src/jocall3/resources/payments/international.py">retrieve_status</a>(payment_id) -> object</code>

## Fx

Types:

```python
from jocall3.types.payments import FxRetrieveRatesResponse
```

Methods:

- <code title="post /payments/fx/convert">client.payments.fx.<a href="./src/jocall3/resources/payments/fx.py">convert_currency</a>() -> object</code>
- <code title="get /payments/fx/rates">client.payments.fx.<a href="./src/jocall3/resources/payments/fx.py">retrieve_rates</a>(\*\*<a href="src/jocall3/types/payments/fx_retrieve_rates_params.py">params</a>) -> <a href="./src/jocall3/types/payments/fx_retrieve_rates_response.py">FxRetrieveRatesResponse</a></code>

# Sustainability

Methods:

- <code title="get /sustainability/carbon-footprint">client.sustainability.<a href="./src/jocall3/resources/sustainability/sustainability.py">retrieve_carbon_footprint</a>() -> object</code>

## Investments

Types:

```python
from jocall3.types.sustainability import InvestmentAnalyzeImpactResponse
```

Methods:

- <code title="get /sustainability/investments/impact">client.sustainability.investments.<a href="./src/jocall3/resources/sustainability/investments.py">analyze_impact</a>() -> <a href="./src/jocall3/types/sustainability/investment_analyze_impact_response.py">InvestmentAnalyzeImpactResponse</a></code>


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/api.md
================================================================================

# Users

Types:

- <code><a href="./src/resources/users/users.ts">UserLoginResponse</a></code>
- <code><a href="./src/resources/users/users.ts">UserRegisterResponse</a></code>

Methods:

- <code title="post /users/login">client.users.<a href="./src/resources/users/users.ts">login</a>({ ...params }) -> UserLoginResponse</code>
- <code title="post /users/register">client.users.<a href="./src/resources/users/users.ts">register</a>({ ...params }) -> UserRegisterResponse</code>

## PasswordReset

Types:

- <code><a href="./src/resources/users/password-reset.ts">PasswordResetConfirmResponse</a></code>
- <code><a href="./src/resources/users/password-reset.ts">PasswordResetInitiateResponse</a></code>

Methods:

- <code title="post /users/password-reset/confirm">client.users.passwordReset.<a href="./src/resources/users/password-reset.ts">confirm</a>({ ...params }) -> PasswordResetConfirmResponse</code>
- <code title="post /users/password-reset/initiate">client.users.passwordReset.<a href="./src/resources/users/password-reset.ts">initiate</a>({ ...params }) -> PasswordResetInitiateResponse</code>

## Me

Types:

- <code><a href="./src/resources/users/me/me.ts">MeRetrieveResponse</a></code>
- <code><a href="./src/resources/users/me/me.ts">MeUpdateResponse</a></code>

Methods:

- <code title="get /users/me">client.users.me.<a href="./src/resources/users/me/me.ts">retrieve</a>() -> MeRetrieveResponse</code>
- <code title="put /users/me">client.users.me.<a href="./src/resources/users/me/me.ts">update</a>({ ...params }) -> MeUpdateResponse</code>

### Preferences

Types:

- <code><a href="./src/resources/users/me/preferences.ts">PreferenceRetrieveResponse</a></code>
- <code><a href="./src/resources/users/me/preferences.ts">PreferenceUpdateResponse</a></code>

Methods:

- <code title="get /users/me/preferences">client.users.me.preferences.<a href="./src/resources/users/me/preferences.ts">retrieve</a>() -> PreferenceRetrieveResponse</code>
- <code title="put /users/me/preferences">client.users.me.preferences.<a href="./src/resources/users/me/preferences.ts">update</a>({ ...params }) -> PreferenceUpdateResponse</code>

### Security

### Devices

Types:

- <code><a href="./src/resources/users/me/devices.ts">DeviceListResponse</a></code>

Methods:

- <code title="get /users/me/devices">client.users.me.devices.<a href="./src/resources/users/me/devices.ts">list</a>({ ...params }) -> DeviceListResponse</code>

### Biometrics

Types:

- <code><a href="./src/resources/users/me/biometrics.ts">BiometricRetrieveStatusResponse</a></code>
- <code><a href="./src/resources/users/me/biometrics.ts">BiometricVerifyResponse</a></code>

Methods:

- <code title="get /users/me/biometrics">client.users.me.biometrics.<a href="./src/resources/users/me/biometrics.ts">retrieveStatus</a>() -> BiometricRetrieveStatusResponse</code>
- <code title="post /users/me/biometrics/verify">client.users.me.biometrics.<a href="./src/resources/users/me/biometrics.ts">verify</a>({ ...params }) -> BiometricVerifyResponse</code>

# Accounts

Types:

- <code><a href="./src/resources/accounts/accounts.ts">AccountListResponse</a></code>
- <code><a href="./src/resources/accounts/accounts.ts">AccountLinkResponse</a></code>
- <code><a href="./src/resources/accounts/accounts.ts">AccountRetrieveDetailsResponse</a></code>

Methods:

- <code title="get /accounts/me">client.accounts.<a href="./src/resources/accounts/accounts.ts">list</a>({ ...params }) -> AccountListResponse</code>
- <code title="post /accounts/link">client.accounts.<a href="./src/resources/accounts/accounts.ts">link</a>({ ...params }) -> AccountLinkResponse</code>
- <code title="get /accounts/{accountId}/details">client.accounts.<a href="./src/resources/accounts/accounts.ts">retrieveDetails</a>(accountID) -> AccountRetrieveDetailsResponse</code>

## Transactions

Types:

- <code><a href="./src/resources/accounts/transactions.ts">TransactionListPendingResponse</a></code>

Methods:

- <code title="get /accounts/{accountId}/transactions/pending">client.accounts.transactions.<a href="./src/resources/accounts/transactions.ts">listPending</a>(accountID, { ...params }) -> TransactionListPendingResponse</code>

## BalanceHistory

## Statements

Types:

- <code><a href="./src/resources/accounts/statements.ts">StatementListResponse</a></code>

Methods:

- <code title="get /accounts/{accountId}/statements">client.accounts.statements.<a href="./src/resources/accounts/statements.ts">list</a>(accountID, { ...params }) -> StatementListResponse</code>

## Overdraft

Types:

- <code><a href="./src/resources/accounts/overdraft.ts">OverdraftRetrieveSettingsResponse</a></code>
- <code><a href="./src/resources/accounts/overdraft.ts">OverdraftUpdateSettingsResponse</a></code>

Methods:

- <code title="get /accounts/{accountId}/overdraft-settings">client.accounts.overdraft.<a href="./src/resources/accounts/overdraft.ts">retrieveSettings</a>(accountID) -> OverdraftRetrieveSettingsResponse</code>
- <code title="put /accounts/{accountId}/overdraft-settings">client.accounts.overdraft.<a href="./src/resources/accounts/overdraft.ts">updateSettings</a>(accountID, { ...params }) -> OverdraftUpdateSettingsResponse</code>

# Transactions

Types:

- <code><a href="./src/resources/transactions/transactions.ts">TransactionRetrieveResponse</a></code>
- <code><a href="./src/resources/transactions/transactions.ts">TransactionListResponse</a></code>
- <code><a href="./src/resources/transactions/transactions.ts">TransactionAddNotesResponse</a></code>
- <code><a href="./src/resources/transactions/transactions.ts">TransactionCategorizeResponse</a></code>

Methods:

- <code title="get /transactions/{transactionId}">client.transactions.<a href="./src/resources/transactions/transactions.ts">retrieve</a>(transactionID) -> TransactionRetrieveResponse</code>
- <code title="get /transactions">client.transactions.<a href="./src/resources/transactions/transactions.ts">list</a>({ ...params }) -> TransactionListResponse</code>
- <code title="put /transactions/{transactionId}/notes">client.transactions.<a href="./src/resources/transactions/transactions.ts">addNotes</a>(transactionID, { ...params }) -> TransactionAddNotesResponse</code>
- <code title="put /transactions/{transactionId}/categorize">client.transactions.<a href="./src/resources/transactions/transactions.ts">categorize</a>(transactionID, { ...params }) -> TransactionCategorizeResponse</code>

## Recurring

Types:

- <code><a href="./src/resources/transactions/recurring.ts">RecurringListResponse</a></code>

Methods:

- <code title="get /transactions/recurring">client.transactions.recurring.<a href="./src/resources/transactions/recurring.ts">list</a>({ ...params }) -> RecurringListResponse</code>

## Insights

Types:

- <code><a href="./src/resources/transactions/insights.ts">InsightRetrieveSpendingTrendsResponse</a></code>

Methods:

- <code title="get /transactions/insights/spending-trends">client.transactions.insights.<a href="./src/resources/transactions/insights.ts">retrieveSpendingTrends</a>() -> InsightRetrieveSpendingTrendsResponse</code>

# AI

## Advisor

Types:

- <code><a href="./src/resources/ai/advisor/advisor.ts">AdvisorChatResponse</a></code>
- <code><a href="./src/resources/ai/advisor/advisor.ts">AdvisorRetrieveHistoryResponse</a></code>

Methods:

- <code title="post /ai/advisor/chat">client.ai.advisor.<a href="./src/resources/ai/advisor/advisor.ts">chat</a>({ ...params }) -> unknown</code>
- <code title="get /ai/advisor/chat/history">client.ai.advisor.<a href="./src/resources/ai/advisor/advisor.ts">retrieveHistory</a>({ ...params }) -> unknown</code>

### Tools

Types:

- <code><a href="./src/resources/ai/advisor/tools.ts">ToolListResponse</a></code>

Methods:

- <code title="get /ai/advisor/tools">client.ai.advisor.tools.<a href="./src/resources/ai/advisor/tools.ts">list</a>({ ...params }) -> unknown</code>

## Oracle

### Simulate

Types:

- <code><a href="./src/resources/ai/oracle/simulate.ts">SimulateRunAdvancedResponse</a></code>
- <code><a href="./src/resources/ai/oracle/simulate.ts">SimulateRunStandardResponse</a></code>

Methods:

- <code title="post /ai/oracle/simulate/advanced">client.ai.oracle.simulate.<a href="./src/resources/ai/oracle/simulate.ts">runAdvanced</a>({ ...params }) -> unknown</code>
- <code title="post /ai/oracle/simulate">client.ai.oracle.simulate.<a href="./src/resources/ai/oracle/simulate.ts">runStandard</a>() -> SimulateRunStandardResponse</code>

### Predictions

### Simulations

Types:

- <code><a href="./src/resources/ai/oracle/simulations.ts">SimulationRetrieveResponse</a></code>
- <code><a href="./src/resources/ai/oracle/simulations.ts">SimulationListResponse</a></code>

Methods:

- <code title="get /ai/oracle/simulations/{simulationId}">client.ai.oracle.simulations.<a href="./src/resources/ai/oracle/simulations.ts">retrieve</a>(simulationID) -> SimulationRetrieveResponse</code>
- <code title="get /ai/oracle/simulations">client.ai.oracle.simulations.<a href="./src/resources/ai/oracle/simulations.ts">list</a>({ ...params }) -> unknown</code>

## Incubator

Types:

- <code><a href="./src/resources/ai/incubator/incubator.ts">IncubatorListPitchesResponse</a></code>
- <code><a href="./src/resources/ai/incubator/incubator.ts">IncubatorSubmitPitchResponse</a></code>

Methods:

- <code title="get /ai/incubator/pitches">client.ai.incubator.<a href="./src/resources/ai/incubator/incubator.ts">listPitches</a>({ ...params }) -> unknown</code>
- <code title="post /ai/incubator/pitch">client.ai.incubator.<a href="./src/resources/ai/incubator/incubator.ts">submitPitch</a>({ ...params }) -> unknown</code>

### Analysis

### Pitch

Types:

- <code><a href="./src/resources/ai/incubator/pitch.ts">PitchRetrieveDetailsResponse</a></code>
- <code><a href="./src/resources/ai/incubator/pitch.ts">PitchSubmitFeedbackResponse</a></code>

Methods:

- <code title="get /ai/incubator/pitch/{pitchId}/details">client.ai.incubator.pitch.<a href="./src/resources/ai/incubator/pitch.ts">retrieveDetails</a>(pitchID) -> PitchRetrieveDetailsResponse</code>
- <code title="put /ai/incubator/pitch/{pitchId}/feedback">client.ai.incubator.pitch.<a href="./src/resources/ai/incubator/pitch.ts">submitFeedback</a>(pitchID) -> unknown</code>

## Ads

Types:

- <code><a href="./src/resources/ai/ads.ts">AdListResponse</a></code>
- <code><a href="./src/resources/ai/ads.ts">AdRetrieveOperationStatusResponse</a></code>

Methods:

- <code title="get /ai/ads">client.ai.ads.<a href="./src/resources/ai/ads.ts">list</a>({ ...params }) -> unknown</code>
- <code title="get /ai/ads/operations/{operationId}">client.ai.ads.<a href="./src/resources/ai/ads.ts">retrieveOperationStatus</a>(operationID) -> unknown</code>

## Agent

## Models

# Corporate

## Compliance

### Audits

Types:

- <code><a href="./src/resources/corporate/compliance/audits.ts">AuditRequestResponse</a></code>
- <code><a href="./src/resources/corporate/compliance/audits.ts">AuditRetrieveReportResponse</a></code>

Methods:

- <code title="post /corporate/compliance/audits">client.corporate.compliance.audits.<a href="./src/resources/corporate/compliance/audits.ts">request</a>() -> unknown</code>
- <code title="get /corporate/compliance/audits/{auditId}/report">client.corporate.compliance.audits.<a href="./src/resources/corporate/compliance/audits.ts">retrieveReport</a>(auditID) -> AuditRetrieveReportResponse</code>

## Treasury

Types:

- <code><a href="./src/resources/corporate/treasury/treasury.ts">TreasuryRetrieveCashFlowForecastResponse</a></code>
- <code><a href="./src/resources/corporate/treasury/treasury.ts">TreasuryRetrieveLiquidityPositionsResponse</a></code>

Methods:

- <code title="get /corporate/treasury/cash-flow/forecast">client.corporate.treasury.<a href="./src/resources/corporate/treasury/treasury.ts">retrieveCashFlowForecast</a>({ ...params }) -> TreasuryRetrieveCashFlowForecastResponse</code>
- <code title="get /corporate/treasury/liquidity-positions">client.corporate.treasury.<a href="./src/resources/corporate/treasury/treasury.ts">retrieveLiquidityPositions</a>() -> TreasuryRetrieveLiquidityPositionsResponse</code>

### Sweeping

### Pooling

## Cards

Types:

- <code><a href="./src/resources/corporate/cards/cards.ts">CardListResponse</a></code>
- <code><a href="./src/resources/corporate/cards/cards.ts">CardFreezeResponse</a></code>
- <code><a href="./src/resources/corporate/cards/cards.ts">CardIssueVirtualResponse</a></code>
- <code><a href="./src/resources/corporate/cards/cards.ts">CardListTransactionsResponse</a></code>

Methods:

- <code title="get /corporate/cards">client.corporate.cards.<a href="./src/resources/corporate/cards/cards.ts">list</a>({ ...params }) -> unknown</code>
- <code title="post /corporate/cards/{cardId}/freeze">client.corporate.cards.<a href="./src/resources/corporate/cards/cards.ts">freeze</a>(cardID) -> CardFreezeResponse</code>
- <code title="post /corporate/cards/virtual">client.corporate.cards.<a href="./src/resources/corporate/cards/cards.ts">issueVirtual</a>({ ...params }) -> CardIssueVirtualResponse</code>
- <code title="get /corporate/cards/{cardId}/transactions">client.corporate.cards.<a href="./src/resources/corporate/cards/cards.ts">listTransactions</a>(cardID, { ...params }) -> unknown</code>

### Controls

Types:

- <code><a href="./src/resources/corporate/cards/controls.ts">ControlUpdateResponse</a></code>

Methods:

- <code title="put /corporate/cards/{cardId}/controls">client.corporate.cards.controls.<a href="./src/resources/corporate/cards/controls.ts">update</a>(cardID) -> ControlUpdateResponse</code>

## Risk

### Fraud

#### Rules

Types:

- <code><a href="./src/resources/corporate/risk/fraud/rules.ts">RuleUpdateResponse</a></code>
- <code><a href="./src/resources/corporate/risk/fraud/rules.ts">RuleListResponse</a></code>

Methods:

- <code title="put /corporate/risk/fraud/rules/{ruleId}">client.corporate.risk.fraud.rules.<a href="./src/resources/corporate/risk/fraud/rules.ts">update</a>(ruleID, { ...params }) -> RuleUpdateResponse</code>
- <code title="get /corporate/risk/fraud/rules">client.corporate.risk.fraud.rules.<a href="./src/resources/corporate/risk/fraud/rules.ts">list</a>({ ...params }) -> unknown</code>

## Governance

### Proposals

## Anomalies

Types:

- <code><a href="./src/resources/corporate/anomalies.ts">AnomalyListResponse</a></code>
- <code><a href="./src/resources/corporate/anomalies.ts">AnomalyUpdateStatusResponse</a></code>

Methods:

- <code title="get /corporate/anomalies">client.corporate.anomalies.<a href="./src/resources/corporate/anomalies.ts">list</a>({ ...params }) -> unknown</code>
- <code title="put /corporate/anomalies/{anomalyId}/status">client.corporate.anomalies.<a href="./src/resources/corporate/anomalies.ts">updateStatus</a>(anomalyID) -> unknown</code>

# Web3

## Wallets

Types:

- <code><a href="./src/resources/web3/wallets.ts">WalletCreateResponse</a></code>
- <code><a href="./src/resources/web3/wallets.ts">WalletListResponse</a></code>
- <code><a href="./src/resources/web3/wallets.ts">WalletRetrieveBalancesResponse</a></code>

Methods:

- <code title="post /web3/wallets">client.web3.wallets.<a href="./src/resources/web3/wallets.ts">create</a>() -> unknown</code>
- <code title="get /web3/wallets">client.web3.wallets.<a href="./src/resources/web3/wallets.ts">list</a>({ ...params }) -> unknown</code>
- <code title="get /web3/wallets/{walletId}/balances">client.web3.wallets.<a href="./src/resources/web3/wallets.ts">retrieveBalances</a>(walletID, { ...params }) -> unknown</code>

## Transactions

Types:

- <code><a href="./src/resources/web3/transactions.ts">TransactionInitiateResponse</a></code>

Methods:

- <code title="post /web3/transactions/initiate">client.web3.transactions.<a href="./src/resources/web3/transactions.ts">initiate</a>() -> unknown</code>

## NFTs

Types:

- <code><a href="./src/resources/web3/nfts.ts">NFTListResponse</a></code>

Methods:

- <code title="get /web3/nfts">client.web3.nfts.<a href="./src/resources/web3/nfts.ts">list</a>({ ...params }) -> unknown</code>

## Contracts

# Payments

## Domestic

## International

Types:

- <code><a href="./src/resources/payments/international.ts">InternationalRetrieveStatusResponse</a></code>

Methods:

- <code title="get /payments/international/{paymentId}/status">client.payments.international.<a href="./src/resources/payments/international.ts">retrieveStatus</a>(paymentID) -> unknown</code>

## Fx

Types:

- <code><a href="./src/resources/payments/fx.ts">FxConvertCurrencyResponse</a></code>
- <code><a href="./src/resources/payments/fx.ts">FxRetrieveRatesResponse</a></code>

Methods:

- <code title="post /payments/fx/convert">client.payments.fx.<a href="./src/resources/payments/fx.ts">convertCurrency</a>() -> unknown</code>
- <code title="get /payments/fx/rates">client.payments.fx.<a href="./src/resources/payments/fx.ts">retrieveRates</a>({ ...params }) -> FxRetrieveRatesResponse</code>

# Sustainability

Types:

- <code><a href="./src/resources/sustainability/sustainability.ts">SustainabilityRetrieveCarbonFootprintResponse</a></code>

Methods:

- <code title="get /sustainability/carbon-footprint">client.sustainability.<a href="./src/resources/sustainability/sustainability.ts">retrieveCarbonFootprint</a>() -> unknown</code>

## Offsets

## Impact

# Marketplace

## Offers

# Lending

## Applications

## Decisions

# Investments

## Portfolios

Types:

- <code><a href="./src/resources/investments/portfolios.ts">PortfolioRetrieveResponse</a></code>
- <code><a href="./src/resources/investments/portfolios.ts">PortfolioUpdateResponse</a></code>
- <code><a href="./src/resources/investments/portfolios.ts">PortfolioListResponse</a></code>
- <code><a href="./src/resources/investments/portfolios.ts">PortfolioRebalanceResponse</a></code>

Methods:

- <code title="get /investments/portfolios/{portfolioId}">client.investments.portfolios.<a href="./src/resources/investments/portfolios.ts">retrieve</a>(portfolioID) -> unknown</code>
- <code title="put /investments/portfolios/{portfolioId}">client.investments.portfolios.<a href="./src/resources/investments/portfolios.ts">update</a>(portfolioID) -> unknown</code>
- <code title="get /investments/portfolios">client.investments.portfolios.<a href="./src/resources/investments/portfolios.ts">list</a>({ ...params }) -> unknown</code>
- <code title="post /investments/portfolios/{portfolioId}/rebalance">client.investments.portfolios.<a href="./src/resources/investments/portfolios.ts">rebalance</a>(portfolioID) -> unknown</code>

## Assets

Types:

- <code><a href="./src/resources/investments/assets.ts">AssetSearchResponse</a></code>

Methods:

- <code title="get /investments/assets/search">client.investments.assets.<a href="./src/resources/investments/assets.ts">search</a>({ ...params }) -> unknown</code>

## Performance

# System

## Status

## Webhooks

## AuditLogs

## Sandbox

## Verification

## Notifications
