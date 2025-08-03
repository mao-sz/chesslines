import zod, { type ZodType } from 'zod';
import type { Repertoire } from './repertoire';

/**
 * Hacky way around validating UUID type.
 * Ideally should use zod.uuidv4() but this is intentionally inferred as `string`
 * See https://github.com/colinhacks/zod/issues/4458#issuecomment-2900223508
 *
 * But it's not yet possible in TS to exclude literals from `string` itself e.g. string not Colour
 * So `Colour | string` just collapses to `string`.
 * But then that poses problems with the RepertoireFolders type which specifically needs a 'w' and 'b' key,
 * while additional string keys (UUIDs) are optional.
 *
 * I can either use an annoyingly narrow UUID template literal type
 * or use `string` and zod.uuidv4() for runtime validation, and deal with casting
 * in useRepertoire.ts due to potentially missing 'w' | 'b' keys that I cannot specify to be narrowed out.
 *
 * With a custom UUID type, early returning on 'w' | 'b' narrows the ID type to UUID.
 * With just `string`, the guard clause does not narrow anything, and the resulting ID type is still `string`
 * That then leads to only { [key: string]: RepertoireFolder }
 * which then errors due to potentially missing 'w' or 'b'.
 *
 * Annoying. Probably a workaround somewhere and if I find one, I may return to this.
 */
const zodUUID = zod.templateLiteral([
    zod.string(),
    '-',
    zod.string(),
    '-',
    zod.string(),
    '-',
    zod.string(),
    '-',
    zod.string(),
]);
const zodColour = zod.union([zod.literal('w'), zod.literal('b')]);
const zodLineNotes = zod.tuple([zod.string()], zod.string());
const zodRepertoireLine = zod.object({
    player: zodColour,
    startingFEN: zod.string(),
    PGN: zod.string(),
    notes: zodLineNotes,
});
const zodRepertoireLines = zod.record(zod.uuidv4(), zodRepertoireLine);

const zodFolder = zod.discriminatedUnion('contains', [
    zod.object({
        name: zod.string(),
        contains: zod.literal('either'),
        children: zod.tuple([]),
    }),
    zod.object({
        name: zod.string(),
        contains: zod.union([zod.literal('folders'), zod.literal('lines')]),
        children: zod.tuple([zodUUID], zodUUID),
    }),
]);
const zodRepertoireFolders = zod
    .object({ w: zodFolder, b: zodFolder })
    .catchall(zodFolder);

export const StoredRepertoire = zod.object({
    folders: zodRepertoireFolders,
    lines: zodRepertoireLines,
}) satisfies ZodType<Repertoire>;
