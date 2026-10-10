import { describe, expect, it } from 'vitest'
import { moveItem, type Columns } from '@/features/tasks/position'

type Item = { id: string }

function board(todo: string[], inProgress: string[], done: string[]): Columns<Item> {
  const toItems = (ids: string[]) => ids.map((id) => ({ id }))
  return { todo: toItems(todo), in_progress: toItems(inProgress), done: toItems(done) }
}

function ids(columns: Columns<Item>) {
  return {
    todo: columns.todo.map((item) => item.id),
    in_progress: columns.in_progress.map((item) => item.id),
    done: columns.done.map((item) => item.id),
  }
}

describe('moveItem', () => {
  it('reorders within a column', () => {
    const result = moveItem(board(['a', 'b', 'c'], [], []), 'a', 'todo', 2)
    expect(ids(result).todo).toEqual(['b', 'c', 'a'])
  })

  it('moves up within a column', () => {
    const result = moveItem(board(['a', 'b', 'c'], [], []), 'c', 'todo', 0)
    expect(ids(result).todo).toEqual(['c', 'a', 'b'])
  })

  it('moves between columns at the given index', () => {
    const result = moveItem(board(['a', 'b'], ['x', 'y'], []), 'a', 'in_progress', 1)
    expect(ids(result)).toEqual({ todo: ['b'], in_progress: ['x', 'a', 'y'], done: [] })
  })

  it('moves into an empty column', () => {
    const result = moveItem(board(['a'], [], []), 'a', 'done', 0)
    expect(ids(result)).toEqual({ todo: [], in_progress: [], done: ['a'] })
  })

  it('clamps an index past the end of the column', () => {
    const result = moveItem(board(['a'], ['x'], []), 'a', 'in_progress', 99)
    expect(ids(result).in_progress).toEqual(['x', 'a'])
  })

  it('returns the same columns for an unknown id', () => {
    const columns = board(['a'], [], [])
    expect(moveItem(columns, 'missing', 'done', 0)).toBe(columns)
  })

  it('does not mutate its input', () => {
    const columns = board(['a', 'b'], [], [])
    moveItem(columns, 'a', 'done', 0)
    expect(ids(columns).todo).toEqual(['a', 'b'])
  })
})
