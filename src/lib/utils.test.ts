import { describe, it, expect } from 'vitest';
import { version_compare } from './utils';

describe('version_compare', () => {
	it('returns 0 if the two versions are equals', () => {
		const result = version_compare('1.0.0', '1.0.0');
		expect(result).toBe(0);
	});
	it('returns 1 if the first version is greater (major)', () => {
		const result = version_compare('2.0.0', '1.0.0');
		expect(result).toBe(1);
	});
	it('returns 1 if the first version is greater (minor)', () => {
		const result = version_compare('1.1.0', '1.0.0');
		expect(result).toBe(1);
	});
	it('returns 1 if the first version is greater (patch)', () => {
		const result = version_compare('1.1.1', '1.1.0');
		expect(result).toBe(1);
	});
	it('returns -1 if the second version is greater (major)', () => {
		const result = version_compare('1.0.0', '2.0.0');
		expect(result).toBe(-1);
	});
	it('returns -1 if the second version is greater (minor)', () => {
		const result = version_compare('1.0.0', '1.1.0');
		expect(result).toBe(-1);
	});
	it('returns -1 if the second version is greater (patch)', () => {
		const result = version_compare('1.1.0', '1.1.1');
		expect(result).toBe(-1);
	});
});
