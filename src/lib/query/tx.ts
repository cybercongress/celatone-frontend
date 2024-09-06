import { graphql } from "lib/gql";

export const getTxsCount = graphql(`
  query getTxsCount {
    transactions(limit: 1, order_by: { id: desc }) {
      id
    }
  }
`);

export const getBlockTransactionsByHeightQueryDocument = graphql(`
  query getBlockTransactionsByHeightQuery(
    $limit: Int!
    $offset: Int!
    $height: Int!
    $isWasm: Boolean!
    $isMove: Boolean!
  ) {
    transactions(
      limit: $limit
      offset: $offset
      where: { block_height: { _eq: $height } }
      order_by: { id: asc }
    ) {
      block {
        height
        timestamp
      }
      account {
        address
      }
      hash
      success
      messages
      is_send
      is_ibc
      is_clear_admin @include(if: $isWasm)
      is_execute @include(if: $isWasm)
      is_instantiate @include(if: $isWasm)
      is_migrate @include(if: $isWasm)
      is_store_code @include(if: $isWasm)
      is_update_admin @include(if: $isWasm)
      is_move_publish @include(if: $isMove)
      is_move_upgrade @include(if: $isMove)
      is_move_execute @include(if: $isMove)
      is_move_script @include(if: $isMove)
    }
  }
`);

export const getBlockTransactionCountByHeightQueryDocument = graphql(`
  query getBlockTransactionCountByHeightQuery($height: Int!) {
    transactions_aggregate(where: { block_height: { _eq: $height } }) {
      aggregate {
        count
      }
    }
  }
`);
