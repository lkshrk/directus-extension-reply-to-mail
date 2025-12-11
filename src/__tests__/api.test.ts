import { md } from "../api";
import { marked } from "marked";
import sanitizeHTML from "sanitize-html";

describe("API Functions", () => {
  describe("md() function", () => {
    it("should convert markdown to sanitized HTML", () => {
      const markdown = "# Hello World";
      const result = md(markdown);

      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("should handle empty string", () => {
      const result = md("");
      expect(result).toBe("");
    });

    it("should sanitize potentially dangerous HTML", () => {
      const dangerousMarkdown = '<script>alert("XSS")</script># Hello';
      const result = md(dangerousMarkdown);

      // Should not contain script tags
      expect(result).not.toContain("<script>");
      expect(result).not.toContain("</script>");
    });

    it("should handle basic markdown formatting", () => {
      const markdown = "**bold** and *italic* text";
      const result = md(markdown);

      expect(result).toContain("<strong>");
      expect(result).toContain("</strong>");
      expect(result).toContain("<em>");
      expect(result).toContain("</em>");
    });

    it("should handle markdown with links", () => {
      const markdown = "[Directus](https://directus.io)";
      const result = md(markdown);

      expect(result).toContain("<a");
      expect(result).toContain('href="https://directus.io"');
      expect(result).toContain(">Directus</a>");
    });
  });

  describe("Operation API Configuration", () => {
    it("should export the operation API configuration", async () => {
      // Import the default export
      const operationApi = (await import("../api")).default;

      expect(operationApi).toBeDefined();
      expect(operationApi.id).toBe("directus-extension-reply-to-mail");
      expect(operationApi.handler).toBeInstanceOf(Function);
    });

    it("should handle different email types correctly", async () => {
      const operationApi = (await import("../api")).default;

      // Mock the services and dependencies
      const mockMailService = {
        send: jest.fn().mockResolvedValue({}),
      };

      const mockContext = {
        accountability: null,
        database: {},
        getSchema: jest.fn().mockResolvedValue({}),
        logger: {
          error: jest.fn(),
        },
        services: {
          MailService: jest.fn().mockReturnValue(mockMailService),
        },
      };

      // Test markdown type
      await operationApi.handler(
        {
          body: "# Test Email",
          type: "markdown",
          to: "test@example.com",
          subject: "Test Subject",
          replyTo: "reply@example.com",
        },
        mockContext,
      );

      expect(mockMailService.send).toHaveBeenCalled();
      const callArgs = mockMailService.send.mock.calls[0][0];
      expect(callArgs.html).toBeTruthy();
      expect(callArgs.subject).toBe("Test Subject");
      expect(callArgs.replyTo).toBe("reply@example.com");
    });

    it("should handle wysiwyg type correctly", async () => {
      const operationApi = (await import("../api")).default;

      const mockMailService = {
        send: jest.fn().mockResolvedValue({}),
      };

      const mockContext = {
        accountability: null,
        database: {},
        getSchema: jest.fn().mockResolvedValue({}),
        logger: {
          error: jest.fn(),
        },
        services: {
          MailService: jest.fn().mockReturnValue(mockMailService),
        },
      };

      await operationApi.handler(
        {
          body: "<p>HTML content</p>",
          type: "wysiwyg",
          to: "test@example.com",
          subject: "Test Subject",
        },
        mockContext,
      );

      expect(mockMailService.send).toHaveBeenCalled();
      const callArgs = mockMailService.send.mock.calls[0][0];
      expect(callArgs.html).toBe("<p>HTML content</p>");
    });

    it("should handle template type correctly", async () => {
      const operationApi = (await import("../api")).default;

      const mockMailService = {
        send: jest.fn().mockResolvedValue({}),
      };

      const mockContext = {
        accountability: null,
        database: {},
        getSchema: jest.fn().mockResolvedValue({}),
        logger: {
          error: jest.fn(),
        },
        services: {
          MailService: jest.fn().mockReturnValue(mockMailService),
        },
      };

      await operationApi.handler(
        {
          template: "custom-template",
          data: { name: "John" },
          type: "template",
          to: "test@example.com",
          subject: "Test Subject",
        },
        mockContext,
      );

      expect(mockMailService.send).toHaveBeenCalled();
      const callArgs = mockMailService.send.mock.calls[0][0];
      expect(callArgs.template).toBeDefined();
      expect(callArgs.template.name).toBe("custom-template");
      expect(callArgs.template.data).toEqual({ name: "John" });
    });

    it("should handle non-string body by converting to JSON", async () => {
      const operationApi = (await import("../api")).default;

      const mockMailService = {
        send: jest.fn().mockResolvedValue({}),
      };

      const mockContext = {
        accountability: null,
        database: {},
        getSchema: jest.fn().mockResolvedValue({}),
        logger: {
          error: jest.fn(),
        },
        services: {
          MailService: jest.fn().mockReturnValue(mockMailService),
        },
      };

      const nonStringBody = { key: "value", nested: { data: "test" } };

      await operationApi.handler(
        {
          body: nonStringBody,
          type: "markdown",
          to: "test@example.com",
          subject: "Test Subject",
        },
        mockContext,
      );

      expect(mockMailService.send).toHaveBeenCalled();
      const callArgs = mockMailService.send.mock.calls[0][0];
      // The non-string body gets converted to JSON and then processed as markdown,
      // which wraps it in <p> tags
      expect(callArgs.html).toContain(JSON.stringify(nonStringBody));
    });

    it("should handle email sending errors gracefully", async () => {
      const operationApi = (await import("../api")).default;

      const mockError = new Error("Mail server unavailable");
      const mockMailService = {
        send: jest.fn().mockRejectedValue(mockError),
      };

      const mockLogger = {
        error: jest.fn(),
      };

      const mockContext = {
        accountability: null,
        database: {},
        getSchema: jest.fn().mockResolvedValue({}),
        logger: mockLogger,
        services: {
          MailService: jest.fn().mockReturnValue(mockMailService),
        },
      };

      await operationApi.handler(
        {
          body: "Test content",
          type: "markdown",
          to: "test@example.com",
          subject: "Test Subject",
        },
        mockContext,
      );

      expect(mockMailService.send).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        mockError,
        'Could not send mail in "mail" operation',
      );
    });
  });
});
