import type { DefinitionNode, ExpressionNode, ModuleReferenceNode } from '../ast';
export type Definitions = {
    [K in string]?: DefinitionNode;
};
export type Imports = {
    [K in string]?: ModuleReferenceNode;
};
export type Scalars = {
    [K in string]?: ExpressionNode;
};
/**
 * Specifies settings for how code should be generated for the given database library.
 */
export declare abstract class Adapter {
    readonly defaultScalar: ExpressionNode;
    readonly defaultSchema: string | null;
    readonly definitions: Definitions;
    readonly imports: Imports;
    readonly scalars: Scalars;
}
