import { describe, expect, test } from '@jest/globals'
import ex from '../src/example'

test('example output', () => {
    expect(ex).toMatchSnapshot()
})