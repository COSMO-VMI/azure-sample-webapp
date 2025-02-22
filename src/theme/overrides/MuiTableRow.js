// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import palette from '../palette'

export default {
  root: {
    '&$selected': {
      backgroundColor: palette.background.default
    },
    '&$hover': {
      '&:hover': {
        backgroundColor: palette.background.default
      }
    }
  }
}
