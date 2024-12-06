import type { SendMailOptions } from 'nodemailer';

export type Options = {
  body?: string;
  template?: string;
  data?: Record<string, any>;
  to: string;
  replyTo?: string;
  type: 'wysiwyg' | 'markdown' | 'template';
  subject: string;
};

export type EmailOptions = Omit<SendMailOptions, 'from'> & {
  from?: string;
  template?: {
    name: string;
    data: Record<string, any>;
  };
};