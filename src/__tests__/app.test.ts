import operationApp from '../app';
import type { Options } from '../_types';

describe('Operation App', () => {
  describe('Operation Configuration', () => {
    it('should have correct operation ID', () => {
      expect(operationApp.id).toBe('directus-extension-reply-to-mail');
    });

    it('should have correct icon', () => {
      expect(operationApp.icon).toBe('mail');
    });

    it('should have correct name', () => {
      expect(operationApp.name).toBe('Mailer (replyTo)');
    });

    it('should have correct description', () => {
      expect(operationApp.description).toBe('Extends the default mailer operation with a replyTo field');
    });

    it('should have overview function', () => {
      expect(operationApp.overview).toBeInstanceOf(Function);
    });

    it('should have options function', () => {
      expect(operationApp.options).toBeInstanceOf(Function);
    });
  });

  describe('Overview Function', () => {
    it('should return correct overview for complete options', () => {
      const options: Options = {
        to: 'test@example.com',
        subject: 'Test Subject',
        replyTo: 'reply@example.com',
        type: 'markdown',
        body: 'Test body',
      };

      const overview = operationApp.overview(options);

      expect(overview).toBeInstanceOf(Array);
      expect(overview.length).toBe(4);

      const subjectItem = overview.find((item: any) => item.label === 'Subject');
      expect(subjectItem).toBeDefined();
      expect(subjectItem.text).toBe('Test Subject');

      const toItem = overview.find((item: any) => item.label === 'To');
      expect(toItem).toBeDefined();
      expect(toItem.text).toBe('test@example.com');

      const replyToItem = overview.find((item: any) => item.label === 'ReplyTo');
      expect(replyToItem).toBeDefined();
      expect(replyToItem.text).toBe('reply@example.com');

      const typeItem = overview.find((item: any) => item.label === 'Type');
      expect(typeItem).toBeDefined();
      expect(typeItem.text).toBe('markdown');
    });

    it('should handle array of email addresses', () => {
      const options: Options = {
        to: ['test1@example.com', 'test2@example.com'],
        subject: 'Test Subject',
        replyTo: 'reply@example.com',
        type: 'markdown',
        body: 'Test body',
      };

      const overview = operationApp.overview(options);
      const toItem = overview.find((item: any) => item.label === 'To');
      expect(toItem.text).toBe('test1@example.com, test2@example.com');
    });

    it('should handle missing replyTo', () => {
      const options: Options = {
        to: 'test@example.com',
        subject: 'Test Subject',
        type: 'markdown',
        body: 'Test body',
      };

      const overview = operationApp.overview(options);
      const replyToItem = overview.find((item: any) => item.label === 'ReplyTo');
      expect(replyToItem.text).toBeUndefined();
    });

    it('should use default type when not specified', () => {
      const options: Options = {
        to: 'test@example.com',
        subject: 'Test Subject',
        replyTo: 'reply@example.com',
        body: 'Test body',
        type: 'wysiwyg',
      };

      const overview = operationApp.overview(options);
      const typeItem = overview.find((item: any) => item.label === 'Type');
      expect(typeItem.text).toBe('wysiwyg');
    });
  });

  describe('Options Function', () => {
    it('should return array of field configurations', () => {
      const panel = { type: 'markdown' };
      const options = operationApp.options(panel);

      expect(options).toBeInstanceOf(Array);
      expect(options.length).toBeGreaterThan(0);
    });

    it('should include to field configuration', () => {
      const panel = { type: 'markdown' };
      const options = operationApp.options(panel);

      const toField = options.find((field: any) => field.field === 'to');
      expect(toField).toBeDefined();
      expect(toField.name).toBe('To');
      expect(toField.type).toBe('csv');
      expect(toField.meta.interface).toBe('tags');
    });

    it('should include subject field configuration', () => {
      const panel = { type: 'markdown' };
      const options = operationApp.options(panel);

      const subjectField = options.find((field: any) => field.field === 'subject');
      expect(subjectField).toBeDefined();
      expect(subjectField.name).toBe('Subject');
      expect(subjectField.type).toBe('string');
    });

    it('should include replyTo field configuration', () => {
      const panel = { type: 'markdown' };
      const options = operationApp.options(panel);

      const replyToField = options.find((field: any) => field.field === 'replyTo');
      expect(replyToField).toBeDefined();
      expect(replyToField.name).toBe('ReplyTo');
      expect(replyToField.type).toBe('string');
    });

    it('should include type field configuration with correct choices', () => {
      const panel = { type: 'markdown' };
      const options = operationApp.options(panel);

      const typeField = options.find((field: any) => field.field === 'type');
      expect(typeField).toBeDefined();
      expect(typeField.name).toBe('Type');
      expect(typeField.type).toBe('string');
      expect(typeField.schema.default_value).toBe('markdown');

      const choices = typeField.meta.options.choices;
      expect(choices).toBeInstanceOf(Array);
      expect(choices.length).toBe(3);

      const markdownChoice = choices.find((c: any) => c.value === 'markdown');
      expect(markdownChoice).toBeDefined();
      expect(markdownChoice.text).toBe('Markdown');

      const wysiwygChoice = choices.find((c: any) => c.value === 'wysiwyg');
      expect(wysiwygChoice).toBeDefined();
      expect(wysiwygChoice.text).toBe('WYSIWYG');

      const templateChoice = choices.find((c: any) => c.value === 'template');
      expect(templateChoice).toBeDefined();
      expect(templateChoice.text).toBe('Template');
    });

    it('should show template field when type is template', () => {
      const panel = { type: 'template' };
      const options = operationApp.options(panel);

      const templateField = options.find((field: any) => field.field === 'template');
      expect(templateField).toBeDefined();
      expect(templateField.meta.hidden).toBe(false);
    });

    it('should hide template field when type is not template', () => {
      const panel = { type: 'markdown' };
      const options = operationApp.options(panel);

      const templateField = options.find((field: any) => field.field === 'template');
      expect(templateField).toBeDefined();
      expect(templateField.meta.hidden).toBe(true);
    });

    it('should show body field when type is not template', () => {
      const panel = { type: 'markdown' };
      const options = operationApp.options(panel);

      const bodyField = options.find((field: any) => field.field === 'body');
      expect(bodyField).toBeDefined();
      expect(bodyField.meta.hidden).toBe(false);
    });

    it('should hide body field when type is template', () => {
      const panel = { type: 'template' };
      const options = operationApp.options(panel);

      const bodyField = options.find((field: any) => field.field === 'body');
      expect(bodyField).toBeDefined();
      expect(bodyField.meta.hidden).toBe(true);
    });

    it('should show data field when type is template', () => {
      const panel = { type: 'template' };
      const options = operationApp.options(panel);

      const dataField = options.find((field: any) => field.field === 'data');
      expect(dataField).toBeDefined();
      expect(dataField.meta.hidden).toBe(false);
    });

    it('should hide data field when type is not template', () => {
      const panel = { type: 'markdown' };
      const options = operationApp.options(panel);

      const dataField = options.find((field: any) => field.field === 'data');
      expect(dataField).toBeDefined();
      expect(dataField.meta.hidden).toBe(true);
    });

    it('should use correct interface for body based on type', () => {
      const markdownPanel = { type: 'markdown' };
      const markdownOptions = operationApp.options(markdownPanel);
      const markdownBodyField = markdownOptions.find((field: any) => field.field === 'body');
      expect(markdownBodyField.meta.interface).toBe('input-rich-text-md');

      const wysiwygPanel = { type: 'wysiwyg' };
      const wysiwygOptions = operationApp.options(wysiwygPanel);
      const wysiwygBodyField = wysiwygOptions.find((field: any) => field.field === 'body');
      expect(wysiwygBodyField.meta.interface).toBe('input-rich-text-html');
    });
  });
});
