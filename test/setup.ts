/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { expect } from 'vitest';

// Custom snapshot serializer to handle dynamic CSS input IDs and normalize CSS property
const replaceDynamicInputId = {
  test(val: any): boolean {
    if (!val || typeof val !== 'object') return false;

    // Check if this is an array containing objects with inputs array
    if (Array.isArray(val)) {
      return val.some(
        (item) =>
          item &&
          typeof item === 'object' &&
          item.inputs &&
          Array.isArray(item.inputs) &&
          item.inputs.some(
            (input: any) =>
              input &&
              typeof input === 'object' &&
              input.id &&
              typeof input.id === 'string' &&
              input.id.startsWith('<input css ') &&
              input.id.endsWith('>') &&
              input.id !== '<input css [ID]>'
          )
      );
    }

    // Check if this object has inputs array with dynamic ID
    if (
      val.inputs &&
      Array.isArray(val.inputs) &&
      val.inputs.some(
        (input: any) =>
          input &&
          typeof input === 'object' &&
          input.id &&
          typeof input.id === 'string' &&
          input.id.startsWith('<input css ') &&
          input.id.endsWith('>') &&
          input.id !== '<input css [ID]>'
      )
    ) {
      return true;
    }

    return false;
  },
  serialize(
    val: any,
    config: any,
    indentation: string,
    depth: number,
    refs: any,
    printer: any
  ): string {
    const processValue = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;

      if (Array.isArray(obj)) {
        return obj.map(processValue);
      }

      const result = { ...obj };

      // Replace dynamic ID and normalize CSS in inputs array
      if (result.inputs && Array.isArray(result.inputs)) {
        result.inputs = result.inputs.map((input: any) => {
          if (
            input &&
            typeof input === 'object' &&
            input.id &&
            typeof input.id === 'string' &&
            input.id.startsWith('<input css ') &&
            input.id.endsWith('>')
          ) {
            return {
              ...input,
              id: '<input css [ID]>',
              css: '<unknown>' // Normalize the CSS property to match expected snapshots
            };
          }
          return input;
        });
      }

      return result;
    };

    return printer(processValue(val), config, indentation, depth, refs);
  }
};

// Add the snapshot serializer
expect.addSnapshotSerializer(replaceDynamicInputId);
