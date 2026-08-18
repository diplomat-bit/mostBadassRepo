// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/integrations/connectors/twilio/service.ts
================================================================================

```typescript
import { Twilio } from 'twilio';
import { env } from '../../../config/environment'; // Assuming environment variables are handled this way
import { Logger } from '../../../utils/logger'; // Assuming a logger utility exists
import {
    TwilioSMSOptions,
    TwilioVoiceOptions,
    TwilioEmailOptions,
    TwilioNotificationService,
} from './types'; // Assuming these types are defined in ./types.ts

const logger = new Logger('TwilioService');

export class TwilioService implements TwilioNotificationService {
    private twilioClient: Twilio;
    private readonly accountSid: string;
    private readonly authToken: string;
    private readonly fromPhoneNumber: string;
    private readonly emailFromAddress: string;

    constructor() {
        this.accountSid = env.TWILIO_ACCOUNT_SID;
        this.authToken = env.TWILIO_AUTH_TOKEN;
        this.fromPhoneNumber = env.TWILIO_PHONE_NUMBER;
        this.emailFromAddress = env.TWILIO_EMAIL_FROM_ADDRESS;


        if (!this.accountSid || !this.authToken || !this.fromPhoneNumber || !this.emailFromAddress) {
            const errorMessage = "Twilio configuration incomplete.  Ensure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, and TWILIO_EMAIL_FROM_ADDRESS are set in environment variables.";
            logger.error(errorMessage);
            throw new Error(errorMessage); // Critical dependency missing
        }

        this.twilioClient = new Twilio(this.accountSid, this.authToken);

        logger.info('Twilio service initialized.');
    }



    async sendSMS(options: TwilioSMSOptions): Promise<void> {
        try {
            if (!options.to) {
                throw new Error('Missing recipient phone number (to) for SMS.');
            }
            if (!options.body) {
                throw new Error('Missing message body for SMS.');
            }

            const message = await this.twilioClient.messages.create({
                body: options.body,
                to: options.to,
                from: this.fromPhoneNumber,
            });

            logger.info(`SMS sent to ${options.to}. Message SID: ${message.sid}`);

        } catch (error: any) {
            logger.error('Error sending SMS:', error);
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
    }


    async makeVoiceCall(options: TwilioVoiceOptions): Promise<void> {
        try {
            if (!options.to) {
                throw new Error('Missing recipient phone number (to) for voice call.');
            }
            if (!options.twiml || !options.url) { //Either TWIML or URL is required.
                throw new Error('Missing Twiml or URL for voice call');
            }


            const call = await this.twilioClient.calls.create({
                twiml: options.twiml, // Use either twiml or url, not both
                url: options.url,
                to: options.to,
                from: this.fromPhoneNumber,
            });

            logger.info(`Voice call initiated to ${options.to}. Call SID: ${call.sid}`);

        } catch (error: any) {
            logger.error('Error making voice call:', error);
            throw new Error(`Failed to make voice call: ${error.message}`);
        }
    }


    async sendEmail(options: TwilioEmailOptions): Promise<void> {
        try {
            if (!options.to) {
                throw new Error('Missing recipient email address (to) for email.');
            }
            if (!options.subject) {
                throw new Error('Missing subject for email.');
            }
            if (!options.body) {
                throw new Error('Missing body for email.');
            }


            const message = await this.twilioClient.messages.create({
                to: options.to,
                from: this.emailFromAddress,
                subject: options.subject,
                body: options.body,
            });
          logger.info(`Email sent to ${options.to}. Message SID: ${message.sid}`);

        } catch (error: any) {
            logger.error('Error sending email:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}
```