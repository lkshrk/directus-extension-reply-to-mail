import { defineOperationApi } from '@directus/extensions';
import { marked } from "marked";
import sanitizeHTML from "sanitize-html";
import type { Options, EmailOptions } from './_types';

export function md(value: string): string {
	const markdown = marked.parse(value) as string;

	return sanitizeHTML(markdown);
}

export default defineOperationApi<Options>({
	id: 'directus-extension-reply-to-mail',

	handler: async ({ body, template, data, to, type, subject, replyTo }, { accountability, database, getSchema, logger, services }) => {
		const { MailService } = services;
		const mailService = new MailService({ schema: await getSchema({ database }), accountability, knex: database });
		const mailObject: EmailOptions = { to, subject, replyTo };
		const safeBody = typeof body !== 'string' ? JSON.stringify(body) : body;

		if (type === 'template') {
			mailObject.template = {
				name: template || 'base',
				data: data || {},
			};
		} else {
			mailObject.html = type === 'wysiwyg' ? safeBody : md(safeBody);
		}

		mailService.send(mailObject).catch((error: any) => {
			logger.error(error, 'Could not send mail in "mail" operation');
		});
	},
});