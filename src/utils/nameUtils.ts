export function extractFirstName(
	fullName: string | null | undefined,
): string | null {
	if (!fullName) return null;
	return fullName.split(' ')[0];
}

export function escapeHtml(str: string) {
	return str.replace(/'/g, '&apos;');
}
