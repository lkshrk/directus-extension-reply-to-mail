import { defineOperationApp } from '@directus/extensions';
import type { Options } from './_types';


export default defineOperationApp({
  id: 'directus-extension-reply-to-mail',
  icon: 'mail',
  name: 'Mailer (replyTo)',
  description: 'Extends the default mailer operation with a replyTo field',
  overview: (options: Options) => [
    {
      label: 'Subject',
      text: options.subject,
    },
    {
      label: 'To',
      text: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    },
    {
      label: 'ReplyTo',
      text: options.replyTo,
    },
    {
      label: 'Type',
      text: options.type || 'markdown',
    },
  ],
  options: (panel) => {
    return [
      {
        field: 'to',
        name: 'To',
        type: 'csv',
        meta: {
          width: 'full',
          interface: 'tags',
          options: {
            placeholder: 'Add e-mail addresses and press enter...',
            iconRight: 'alternate_email',
          },
        },
      },
      {
        field: 'subject',
        name: 'Subject',
        type: 'string',
        meta: {
          width: 'full',
          interface: 'input',
          options: {
            iconRight: 'title',
          },
        },
      },
      {
        field: 'replyTo',
        name: 'ReplyTo',
        type: 'string',
        meta: {
          width: 'full',
          interface: 'input',
          options: {
            iconRight: 'alternate_email',
          },
        },
      },
      {
        field: 'type',
        name: 'Type',
        type: 'string',
        schema: {
          default_value: 'markdown',
        },
        meta: {
          interface: 'select-dropdown',
          width: 'half',
          options: {
            choices: [
              {
                text: 'Markdown',
                value: 'markdown',
              },
              {
                text: 'WYSIWYG',
                value: 'wysiwyg',
              },
              {
                text: 'Template',
                value: 'template',
              },
            ],
          },
        },
      },
      {
        field: 'template',
        name: 'Template',
        type: 'string',
        meta: {
          interface: 'input',
          hidden: panel.type !== 'template',
          width: 'half',
          options: {
            placeholder: 'base',
          },
        },
      },
      {
        field: 'body',
        name: 'Body',
        type: 'text',
        meta: {
          width: 'full',
          interface: panel.type === 'wysiwyg' ? 'input-rich-text-html' : 'input-rich-text-md',
          hidden: panel.type === 'template',
        },
      },
      {
        field: 'data',
        name: 'Data',
        type: 'json',
        meta: {
          width: 'full',
          interface: 'input-code',
          hidden: panel.type !== 'template',
          options: {
            language: 'json',
            placeholder: JSON.stringify(
              {
                url: 'example.com',
              },
              null,
              2,
            ),
            template: JSON.stringify(
              {
                url: 'example.com',
              },
              null,
              2,
            ),
          },
        },
      },
    ];
  },
});