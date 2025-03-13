import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from '@jest/globals'
import FormData from 'form-data'
import { transformObjToFormData } from '../src/helpers/utils'
import { checkFormDataValue } from './helpers'

describe('Utils', () => {
  test('transformObjToFormData - filtering', async () => {
    const data = new FormData()
    const formData = transformObjToFormData(
      data,
      {
        logic: 'and',
        conditions: [
          {
            operator: 'begins',
            value: 'track_name-begins-value',
            field: 'track_name',
          },
          {
            logic: 'or',
            conditions: [
              {
                operator: 'gt',
                value: 153,
                field: 'bpm',
              },
            ],
          },
        ],
      },
      'filter',
    )

    // @ts-expect-error wrong types
    const streams = formData?._streams
    expect(checkFormDataValue(streams, 'filter[logic]')).toBe(true)
    expect(checkFormDataValue(streams, 'and')).toBe(true)
    expect(checkFormDataValue(streams, 'filter[conditions][0][operator]')).toBe(true)
    expect(checkFormDataValue(streams, 'begins')).toBe(true)
    expect(checkFormDataValue(streams, 'filter[conditions][0][field]')).toBe(true)
    expect(checkFormDataValue(streams, 'track_name')).toBe(true)
    expect(checkFormDataValue(streams, 'filter[conditions][0][value]')).toBe(true)
    expect(checkFormDataValue(streams, 'track_name-begins-value')).toBe(true)
    expect(checkFormDataValue(streams, 'filter[conditions][1][logic]')).toBe(true)
    expect(checkFormDataValue(streams, 'or')).toBe(true)
    expect(checkFormDataValue(streams, 'filter[conditions][1][conditions][0][operator]')).toBe(true)
    expect(checkFormDataValue(streams, 'gt')).toBe(true)
    expect(checkFormDataValue(streams, 'filter[conditions][1][conditions][0][field]')).toBe(true)
    expect(checkFormDataValue(streams, 'bpm')).toBe(true)
    expect(checkFormDataValue(streams, 'filter[conditions][1][conditions][0][value]')).toBe(true)
    expect(checkFormDataValue(streams, '153')).toBe(true)
  })

  test('transformObjToFormData - playlist data', async () => {
    const data = new FormData()
    const formData = transformObjToFormData(
      data,
      {
        playlist_length: 25,
        tracks: [
          {
            type: 'client',
            value: 'value-cl',
          },
          {
            type: 'system',
            value: 'value-sys',
          },
          {
            type: 'file',
            value: fs.createReadStream(path.resolve('test/data/sample.mp3')),
          },
        ],
        active: true,
      },
      '',
    )
    // @ts-expect-error wrong types
    const streams = formData?._streams
    expect(checkFormDataValue(streams, 'playlist_length')).toBe(true)
    expect(checkFormDataValue(streams, '25')).toBe(true)
    expect(checkFormDataValue(streams, 'tracks[0][type]')).toBe(true)
    expect(checkFormDataValue(streams, 'client')).toBe(true)
    expect(checkFormDataValue(streams, 'tracks[0][value]')).toBe(true)
    expect(checkFormDataValue(streams, 'value-cl')).toBe(true)
    expect(checkFormDataValue(streams, 'tracks[1][type]')).toBe(true)
    expect(checkFormDataValue(streams, 'system')).toBe(true)
    expect(checkFormDataValue(streams, 'tracks[1][value]')).toBe(true)
    expect(checkFormDataValue(streams, 'value-sys')).toBe(true)
    expect(checkFormDataValue(streams, 'tracks[2][type]')).toBe(true)
    expect(checkFormDataValue(streams, 'file')).toBe(true)
    expect(checkFormDataValue(streams, 'active')).toBe(true)
    expect(checkFormDataValue(streams, 'true')).toBe(true)
  })
})
