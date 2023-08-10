const validateQuery = (
	query: object
): { valid: false } | { valid: true; queryString: string } => {
	const hasRequiredFields = "a" in query && "b" in query

	if (!hasRequiredFields) {
		return { valid: false }
	}

	const numberA = Number(query.a)
	const numberB = Number(query.b)

	if (Number.isNaN(numberA) || Number.isNaN(numberB)) {
		return { valid: false }
	}

	return {
		valid: true,
		queryString: JSON.stringify(query),
	}
}

export default validateQuery