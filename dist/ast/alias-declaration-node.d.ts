import type { ExpressionNode } from './expression-node';
import { NodeType } from './node-type';
import type { TemplateNode } from './template-node';
export declare class AliasDeclarationNode {
    readonly body: ExpressionNode | TemplateNode;
    readonly name: string;
    readonly type = NodeType.ALIAS_DECLARATION;
    constructor(name: string, body: ExpressionNode | TemplateNode);
}
