import { describe, it, expect, beforeEach, vi } from 'vitest';

const createMockGroq = vi.fn();
const createMockNvidia = vi.fn();

vi.mock('groq-sdk', () => {
  return {
    default: class MockGroq {
      chat = {
        completions: {
          create: createMockGroq,
        },
      };
      models = {
        list: vi.fn().mockResolvedValue({ data: [] }),
      };
    },
  };
});

vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      chat = {
        completions: {
          create: createMockNvidia,
        },
      };
      models = {
        list: vi.fn().mockResolvedValue({ data: [] }),
      };
      constructor(_opts: unknown) {}
    },
  };
});

import { reviewDiff } from '../src/ai.js';

const VALID_RESPONSE = {
  summary: 'Looks fine.',
  bugs: [],
  security: [],
  style: [],
  suggestions: [],
  score: 90,
};

beforeEach(() => {
  process.env.GROQ_API_KEY = 'test-key';
  process.env.NVIDIA_API_KEY = 'test-nvidia-key';
  createMockGroq.mockReset();
  createMockNvidia.mockReset();
});

describe('reviewDiff JSON validation', () => {
  it('throws clear error when GROQ_API_KEY is missing (groq provider)', async () => {
    delete process.env.GROQ_API_KEY;
    await expect(reviewDiff('diff', { model: 'm', provider: 'groq' })).rejects.toThrow(/Missing GROQ_API_KEY/);
  });

  it('throws clear error when NVIDIA_API_KEY is missing (nvidia provider)', async () => {
    delete process.env.NVIDIA_API_KEY;
    await expect(reviewDiff('diff', { model: 'm', provider: 'nvidia' })).rejects.toThrow(/Missing NVIDIA_API_KEY/);
  });

  it('parses a valid JSON response', async () => {
    createMockNvidia.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(VALID_RESPONSE) } }],
    });
    const result = await reviewDiff('diff', { model: 'm', provider: 'nvidia' });
    expect(result.score).toBe(90);
    expect(result.summary).toBe('Looks fine.');
    expect(result.bugs).toEqual([]);
  });

  it('clamps score to 0-100', async () => {
    createMockNvidia.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ ...VALID_RESPONSE, score: 250 }) } }],
    });
    const result = await reviewDiff('diff', { model: 'm', provider: 'nvidia' });
    expect(result.score).toBe(100);
  });

  it('throws when response is not valid JSON', async () => {
    createMockNvidia.mockResolvedValue({ choices: [{ message: { content: 'not json at all' } }] });
    await expect(reviewDiff('diff', { model: 'm', provider: 'nvidia' })).rejects.toThrow(/Failed to parse JSON/);
  });

  it('throws when required fields are missing', async () => {
    createMockNvidia.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ summary: 'ok', score: 80 }) } }],
    });
    await expect(reviewDiff('diff', { model: 'm', provider: 'nvidia' })).rejects.toThrow(/must be an array/);
  });

  it('throws when severity is invalid', async () => {
    createMockNvidia.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ ...VALID_RESPONSE, bugs: [{ severity: 'oopsie', file: 'a.ts', message: 'bad' }] }) } }],
    });
    await expect(reviewDiff('diff', { model: 'm', provider: 'nvidia' })).rejects.toThrow(/severity is invalid/);
  });

  it('throws when content is empty', async () => {
    createMockNvidia.mockResolvedValue({ choices: [{ message: { content: '' } }] });
    await expect(reviewDiff('diff', { model: 'm', provider: 'nvidia' })).rejects.toThrow(/empty response/);
  });
});
