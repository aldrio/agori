import {
  ApolloServerPlugin,
  GraphQLRequestContext,
} from 'apollo-server-plugin-base'
import Objection, { Model, Transaction } from 'objection'

export interface TrxContext {
  trx: Promise<Objection.Transaction>
}

/**
 * Attach a transaction to a context throughout execution.
 * Rolls back the transaction if any errors occurred and commits it otherwise
 */
export const TransactionPlugin: ApolloServerPlugin = {
  requestDidStart(requestContext: GraphQLRequestContext<TrxContext>) {
    let trx: Promise<Transaction> | undefined
    let transactionResult: Promise<void> | undefined
    return {
      executionDidStart() {
        // Create transaciton and add it to context
        trx = Model.startTransaction()
        requestContext.context.trx = trx

        return () => {
          // Commit transaction if no errors
          if (trx && !transactionResult) {
            transactionResult = trx.then((trx) => trx.commit())
          }
        }
      },

      didEncounterErrors() {
        // Rollback transaction if any errors
        if (trx && !transactionResult) {
          transactionResult = trx.then((trx) => trx.rollback())
        }
      },

      async willSendResponse() {
        // Handle any last minute errors that occurred while committing / rolling back the transaction
        if (trx && transactionResult) {
          await transactionResult
        }
      },
    }
  },
}
