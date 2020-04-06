
export async function levelDefault(key: string, value: object): Promise<void> {
  const { db } = global;

  try { // https://github.com/Level/levelup#dbgetkey-options-callback
    await db.get(key);
  } catch (err) {
    if (!err.notFound) {
      throw err;
    }
    await db.put(key, value);
  }
}

export async function levelDefaults(values: object): Promise<void> {
  for (const [key, value] of Object.entries(values)) {
    await levelDefault(key, value);
  }
}
