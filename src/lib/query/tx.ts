import { graphql } from "lib/gql";

export const getTxsByAddressPagination = graphql(`
  query getTxsByAddressPagination(
    $expression: account_transactions_bool_exp
    $offset: Int!
    $pageSize: Int!
  ) {
    account_transactions(
      where: $expression
      order_by: { block_height: desc }
      offset: $offset
      limit: $pageSize
    ) {
      block {
        height
        timestamp
      }
      transaction {
        account {
          address
        }
        hash
        success
        messages
        is_clear_admin
        is_execute
        is_ibc
        is_instantiate
        is_migrate
        is_send
        is_store_code
        is_update_admin
      }
      is_signer
    }
  }
`);

export const getTxsCountByAddress = graphql(`
  query getTxsCountByAddress($expression: account_transactions_bool_exp) {
    account_transactions_aggregate(where: $expression) {
      aggregate {
        count
      }
    }
  }
`);
