import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isMobileDevice,
  canShareFiles,
  canShareUrl,
  shareResult,
  shareQuizInvite,
  downloadAsset,
  ShareAsset,
} from './exportUtils';

describe('exportUtils', () => {
  const originalNavigator = globalThis.navigator;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
  });

  describe('isMobileDevice', () => {
    it('detects mobile user agents', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)' },
        configurable: true,
        writable: true,
      });
      expect(isMobileDevice()).toBe(true);

      Object.defineProperty(globalThis, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8)' },
        configurable: true,
        writable: true,
      });
      expect(isMobileDevice()).toBe(true);
    });

    it('returns false for desktop user agents', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
        configurable: true,
        writable: true,
      });
      expect(isMobileDevice()).toBe(false);
    });
  });

  describe('canShareFiles', () => {
    it('returns false when navigator.canShare is missing', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: { share: vi.fn() },
        configurable: true,
        writable: true,
      });
      expect(canShareFiles()).toBe(false);
    });

    it('returns true when navigator.canShare accepts files', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          share: vi.fn(),
          canShare: vi.fn(({ files }) => Boolean(files && files.length > 0)),
        },
        configurable: true,
        writable: true,
      });
      expect(canShareFiles()).toBe(true);
    });

    it('returns false when navigator.canShare throws an exception', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          share: vi.fn(),
          canShare: vi.fn(() => {
            throw new Error('Unsupported');
          }),
        },
        configurable: true,
        writable: true,
      });
      expect(canShareFiles()).toBe(false);
    });
  });

  describe('canShareUrl', () => {
    it('returns true when navigator.share is present', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: { share: vi.fn() },
        configurable: true,
        writable: true,
      });
      expect(canShareUrl()).toBe(true);
    });

    it('returns false when navigator.share is absent', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {},
        configurable: true,
        writable: true,
      });
      expect(canShareUrl()).toBe(false);
    });
  });

  describe('shareResult', () => {
    const dummyAsset: ShareAsset = {
      format: 'portrait',
      blob: new Blob(['test'], { type: 'image/png' }),
      filename: 'heretiq-the-technocrat-portrait.png',
      title: 'HERETIQ · The Technocrat',
      text: 'I got The Technocrat on HERETIQ.',
    };

    it('returns unsupported when file sharing is not supported', async () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: { canShare: () => false, share: vi.fn() },
        configurable: true,
        writable: true,
      });

      const result = await shareResult(dummyAsset, 'https://heretiq.app/#card=123');
      expect(result).toBe('unsupported');
    });

    it('returns shared when navigator.share succeeds', async () => {
      const shareMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          canShare: () => true,
          share: shareMock,
        },
        configurable: true,
        writable: true,
      });

      const result = await shareResult(dummyAsset, 'https://heretiq.app/#card=123');
      expect(result).toBe('shared');
      expect(shareMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: dummyAsset.title,
          text: `${dummyAsset.text} https://heretiq.app/#card=123`,
        })
      );
    });

    it('returns cancelled when user aborts the share sheet', async () => {
      const abortError = new DOMException('User cancelled', 'AbortError');
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          canShare: () => true,
          share: vi.fn().mockRejectedValue(abortError),
        },
        configurable: true,
        writable: true,
      });

      const result = await shareResult(dummyAsset, 'https://heretiq.app/#card=123');
      expect(result).toBe('cancelled');
    });

    it('returns failed on unexpected errors', async () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          canShare: () => true,
          share: vi.fn().mockRejectedValue(new Error('Unknown network error')),
        },
        configurable: true,
        writable: true,
      });

      const result = await shareResult(dummyAsset, 'https://heretiq.app/#card=123');
      expect(result).toBe('failed');
    });
  });

  describe('shareQuizInvite', () => {
    it('shares native url when navigator.share is available', async () => {
      const shareMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(globalThis, 'navigator', {
        value: { share: shareMock },
        configurable: true,
        writable: true,
      });

      const result = await shareQuizInvite('https://heretiq.app');
      expect(result).toBe('shared');
      expect(shareMock).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://heretiq.app',
          text: 'Discover your political archetype on HERETIQ — 18 questions under 5 minutes. Take the quiz:',
        })
      );
    });

    it('returns cancelled when user aborts native invite share', async () => {
      const abortError = new DOMException('Cancelled', 'AbortError');
      Object.defineProperty(globalThis, 'navigator', {
        value: { share: vi.fn().mockRejectedValue(abortError) },
        configurable: true,
        writable: true,
      });

      const result = await shareQuizInvite('https://heretiq.app');
      expect(result).toBe('cancelled');
    });

    it('falls back to clipboard when share is unavailable', async () => {
      const clipboardMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          clipboard: { writeText: clipboardMock },
        },
        configurable: true,
        writable: true,
      });

      const result = await shareQuizInvite('https://heretiq.app');
      expect(result).toBe('copied');
      expect(clipboardMock).toHaveBeenCalledWith('https://heretiq.app');
    });

    it('returns failed when both share and clipboard fail', async () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {},
        configurable: true,
        writable: true,
      });

      const result = await shareQuizInvite('https://heretiq.app');
      expect(result).toBe('failed');
    });
  });

  describe('downloadAsset', () => {
    it('triggers blob download with link click in browser DOM', () => {
      const asset: ShareAsset = {
        format: 'portrait',
        blob: new Blob(['data']),
        filename: 'heretiq-test.png',
        title: 'Test',
        text: 'Test',
      };

      globalThis.URL.createObjectURL = vi.fn(() => 'blob:test');
      globalThis.URL.revokeObjectURL = vi.fn();

      const clickMock = vi.fn();
      const appendChildMock = vi.fn();
      const removeChildMock = vi.fn();

      const mockLink = {
        href: '',
        download: '',
        click: clickMock,
      };

      const mockDoc = {
        createElement: vi.fn(() => mockLink),
        body: {
          appendChild: appendChildMock,
          removeChild: removeChildMock,
        },
      };

      Object.defineProperty(globalThis, 'document', {
        value: mockDoc,
        configurable: true,
        writable: true,
      });

      downloadAsset(asset);

      expect(mockDoc.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.download).toBe('heretiq-test.png');
      expect(mockLink.href).toBe('blob:test');
      expect(clickMock).toHaveBeenCalled();
    });
  });
});
