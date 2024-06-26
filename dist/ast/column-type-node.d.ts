import type { ExpressionNode } from './expression-node';
import { GenericExpressionNode } from './generic-expression-node';
export declare class ColumnType extends GenericExpressionNode {
    constructor(selectType: ExpressionNode, insertType?: ExpressionNode, updateType?: ExpressionNode);
}
