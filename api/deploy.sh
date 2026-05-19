#!/bin/bash
# Deploy Frontier Leaderboard API to Azure Functions (Consumption plan)
# Prerequisites: az login, Azure CLI installed
# Cost: effectively $0/month for demo usage

set -euo pipefail

# ─── Configuration ───────────────────────────────────────────────
RG="rg-frontier-game"
LOCATION="japaneast"
STORAGE_ACCOUNT="stfrontiergame$(openssl rand -hex 3)"
FUNC_APP="func-frontier-leaderboard"
# ─────────────────────────────────────────────────────────────────

echo "▸ Creating resource group: $RG"
az group create --name "$RG" --location "$LOCATION" --output none

echo "▸ Creating storage account: $STORAGE_ACCOUNT"
az storage account create \
  --name "$STORAGE_ACCOUNT" \
  --resource-group "$RG" \
  --location "$LOCATION" \
  --sku Standard_LRS \
  --output none

echo "▸ Getting storage connection string"
CONN_STR=$(az storage account show-connection-string \
  --name "$STORAGE_ACCOUNT" \
  --resource-group "$RG" \
  --query connectionString -o tsv)

echo "▸ Creating Function App: $FUNC_APP (Node 22, Consumption plan)"
az functionapp create \
  --name "$FUNC_APP" \
  --resource-group "$RG" \
  --storage-account "$STORAGE_ACCOUNT" \
  --consumption-plan-location "$LOCATION" \
  --runtime node \
  --runtime-version 22 \
  --functions-version 4 \
  --output none

echo "▸ Setting app settings"
az functionapp config appsettings set \
  --name "$FUNC_APP" \
  --resource-group "$RG" \
  --settings "TABLE_CONNECTION=$CONN_STR" \
  --output none

echo "▸ Configuring CORS (GitHub Pages)"
az functionapp cors add \
  --name "$FUNC_APP" \
  --resource-group "$RG" \
  --allowed-origins "https://sonic74129.github.io" \
  --output none

echo "▸ Building API..."
cd "$(dirname "$0")"
npm install
npm run build

echo "▸ Deploying..."
func azure functionapp publish "$FUNC_APP"

API_URL="https://${FUNC_APP}.azurewebsites.net"
echo ""
echo "✓ Deployed! API URL: $API_URL"
echo ""
echo "▸ Set in your .env.local:"
echo "  VITE_LEADERBOARD_API=$API_URL/api/leaderboard"
echo ""
echo "▸ Or set in GitHub Pages env (vite build):"
echo "  Add VITE_LEADERBOARD_API to your GitHub Actions secrets"
