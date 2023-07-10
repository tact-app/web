import { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { RootStoreProvider } from '../stores/RootStore';
import Layout from '../components/Layout';
import { InputWrapperStyles } from '../components/shared/InputWrapper';
import { useRouter } from 'next/router';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import 'react-datepicker/dist/react-datepicker.css';

const theme = extendTheme({
  styles: {
    global: (props) => ({
      'html, body': {
        lineHeight: 'normal',
      },
      body: {
        '--toast-z-index': 1200,
        'em-emoji-picker': {
          '--border-radius': 0,
          '--sidebar-width': 0,
          '--shadow': 0,
          width: '100%',
        },
        '.clear': {
          clear: 'both',
        },
        '.mouse-select__frame': {
          background: 'blue.75',
          opacity: .3,
          border: '1px solid #4299e1',
        },
        '.ProseMirror': {
          color: 'gray.700',
          // @see https://github.com/jesster2k10/guava-cards/blob/5d5c283eb720bf503258f4e17bce3865d35fd8d3/packages/website/src/bundles/editor/ContentEditor.tsx#L86
          'ul[data-type="taskList"]': {
            listStyle: 'none',
            padding: 0,

            p: {
              margin: 0,
            },

            li: {
              display: 'flex',

              '> label': {
                flex: '0 0 auto',
                marginRight: '0.5rem',
                userSelect: 'none',
                '> input': {
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'gray.200',
                  width: 4,
                  height: 4,
                },
              },

              '> div': {
                flex: '1 1 auto',
              },
            },
          },
          'p.is-editor-empty:first-child::before': {
            content: 'attr(data-placeholder)',
            color: 'gray.500',
            float: 'left',
            pointerEvents: 'none',
            height: 0,
          },
          '&:focus': {
            outline: 'none',
          },
          h1: {
            fontSize: '1.375rem',
            mt: 4,
          },
          h2: {
            fontSize: '1.125rem',
            mt: 4,
          },
          h3: {
            fontSize: '1rem',
            mt: 4,
          },
          p: {
            fontSize: '1rem',
          },
          'h1, h2, h3, h4,  h5, h6 ': {
            fontWeight: '700',
          },
          'ul, ol': {
            padding: '0 1.2rem',
          },
          ol: {
            listStyle: 'decimal',
            ol: {
              listStyle: 'lower-alpha',
              ol: {
                listStyle: 'lower-roman',
                ol: {
                  listStyle: 'decimal',
                  ol: {
                    listStyle: 'lower-alpha',
                    ol: {
                      listStyle: 'lower-roman',
                    },
                  },
                },
              },
            },
          },
          code: {
            bg: 'rgba(#616161, 0.1)',
            color: '#616161',
          },
          pre: {
            fontFamily: "JetBrainsMono, 'Courier New', Courier, monospace",
            background: mode('gray.900', 'blue.200')(props),
            color: mode('white', 'gray.900')(props),
            padding: '0.75rem 1rem',
            rounded: 'lg',
            whiteSpace: 'pre-wrap',
            code: {
              color: 'inherit',
              p: 0,
              background: 'none',
              fontSize: '0.8rem',
            },

            '.hljs-comment, .hljs-quote': {
              color: '#616161',
            },

            '.hljs-variable, .hljs-template-variable,  .hljs-attribute, .hljs-tag, .hljs-name, .hljs-regexp, .hljs-link, .hljs-name, .hljs-selector-id, .hljs-selector-class':
              {
                color: '#F98181',
              },

            '.hljs-number,  .hljs-meta, .hljs-built_in, .hljs-builtin-name, .hljs-literal,  .hljs-type, .hljs-params':
              {
                color: '#FBBC88',
              },

            '.hljs-string, .hljs-symbol, .hljs-bullet': {
              color: '#B9F18D',
            },

            '.hljs-title, .hljs-section': {
              color: '#FAF594',
            },

            '.hljs-keyword, .hljs-selector-tag': {
              color: '#70CFF8',
            },

            '.hljs-emphasis': {
              fontStyle: 'italic',
            },

            '.hljs-strong': {
              fontWeight: 700,
            },
          },
          blockquote: {
            pl: 4,
            borderLeft: '2px solid rgba(13, 13, 13, 0.1)',
          },
          'span[data-spoiler]': {
            bg: mode('gray.900', 'gray.100')(props),
            _hover: {
              bg: 'transparent',
            },
            // @apply dark:bg-gray-100 bg-gray-900 dark:hover:bg-transparent hover:bg-transparent;
          },
          img: {
            maxW: 'full',
            h: 'auto',
          },
          mark: {
            bg: '#FAF594',
          },
          hr: {
            border: 'none',
            borderTop: '2px solid rgba(#0D0D0D, 0.1)',
          },
        },
        '.react-datepicker-wrapper': {
          width: 'auto',

          '.react-datepicker-ignore-onclickoutside': {
            outline: 'none',

            _focus: {
              borderRadius: 4,
              borderWidth: 0,
              bg: 'gray.75',
            },
            '&.datepicker-focused': {
              borderRadius: 4,
              borderWidth: 0,
              bg: 'gray.75',
            }
          },
          '.react-datepicker__input-container': {
            maxWidth: '100px',
            width: 'auto',

            '& input': {
              width: '100%',
              p: 1,
              ml: 1,
            }
          },

          '&.only-icon': {
            '.react-datepicker__input-container input': {
              ml: 0,
              pt: 1,
              pb: 1,
              pl: 0,
              pr: 0,
            },
            '.datepicker-focused.react-datepicker-ignore-onclickoutside': {
              p: 1,
            }
          },
          '&.disabled': {
            '.react-datepicker__input-container input': {
              w: 0
            },
          }
        },
        '.react-datepicker': {
          fontFamily: 'var(--chakra-fonts-body)',
          fontSize: 'sm',
          borderRadius: 16,
          borderColor: 'gray.200',

          _hover: {
            '.container-overlay': {
              zIndex: -1,
            }
          },

          '.container-overlay': {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'white',
            zIndex: 99,
            opacity: 0.3,
          },
          '.react-datepicker__triangle': {
            display: 'none',
          },
          '.react-datepicker__header': {
            background: 'white',
            border: 0,
          },
          '.react-datepicker__day-names': {
            margin: 0,
          },
          '.react-datepicker__day-name': {
            fontWeight: 'semibold',
            fontSize: 'xs',
            color: 'gray.400',
            lineHeight: 4,
            width: 10,
            margin: 0,
          },
          '.react-datepicker__month-container': {
            pl: 5,
            pr: 5,
            pt: 4,
            pb: 6,
          },
          '.react-datepicker__day': {
            padding: 0,
            margin: 0,
            width: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
            position: 'relative',

            _hover: {
              bg: 'transparent',
            },

            '.day': {
              width: 8,
              height: 8,
              margin: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              fontWeight: 'medium',
              border: 0,
              color: 'gray.700',
              zIndex: 2,

              _hover: {
                bg: 'gray.100',
              }
            },
            '.day-backdrop': {
              width: '100%',
              height: 8,
              position: 'absolute',
              background: 'transparent',
              zIndex: 0,
            },
          },
          '.react-datepicker__day--today': {
            bg: 'transparent',

            _hover: {
              bg: 'transparent',
            },

            '.day': {
              bg: 'purple.300',
              color: 'white',

              _hover: {
                bg: 'purple.400',
              }
            }
          },
          [
            '.react-datepicker__day--in-selecting-range.react-datepicker__day--today, ' +
            '.react-datepicker__day--in-selecting-range.react-datepicker__day--today, ' +
            '.react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-start.react-datepicker__day--today, ' +
            '.react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-end.react-datepicker__day--today, ' +
            '.react-datepicker__day--in-range:not(.react-datepicker__day--in-selecting-range).react-datepicker__day--today'
          ]: {
            '.day': {
              bg: 'purple.300',
              color: 'white',
              borderRadius: '50%',

              _hover: {
                bg: 'purple.400',
              }
            }
          },
          '.react-datepicker__day--disabled': {
            '.day': {
              color: 'gray.400',

              _hover: {
                bg: 'transparent'
              }
            },
          },
          '.react-datepicker__day--outside-month': {
            '.day': {
              color: 'gray.500',
            },
            '&.react-datepicker__day--disabled': {
              '.day': {
                color: 'gray.400',
              }
            },
          },
          '.react-datepicker__day--outside-month.react-datepicker__day--today, .react-datepicker__day--disabled.react-datepicker__day--today': {
            '.day': {
              color: 'white',

              _hover: {
                bg: 'purple.400',
              }
            }
          },
          '.react-datepicker__day--in-range': {
            bg: 'transparent',

            '.day': {
              color: 'gray.500',
            }
          },
          [
            '.react-datepicker__day--selecting-range-start, ' +
            '.react-datepicker__day--selecting-range-end, ' +
            '.react-datepicker__day--selected, ' +
            '.react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-end, ' +
            '.react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-start '
          ]: {
            bg: 'transparent',

            _hover: {
              bg: 'transparent'
            },

            '.day': {
              bg: 'blue.300',
              color: 'white',

              _hover: {
                bg: 'blue.400',
              },
            },
          },
          '.react-datepicker__day--selecting-range-start.react-datepicker__day--selecting-range-end': {
            '.day-backdrop': {
              bg: 'transparent',
            },
          },
          '.react-datepicker__day--selecting-range-start, .react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-start': {
            '.day': {
              borderRadius: '50%',
            },

            '.day-backdrop': {
              left: 4,
            },
          },
          '.react-datepicker__day--selecting-range-end, .react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-end': {
            '.day': {
              borderRadius: '50%',
            },

            '.day-backdrop': {
              left: -4,
            },
          },
          '.react-datepicker__day--in-selecting-range': {
            bg: 'transparent',

            '.day': {
              bg: 'blue.75',
              color: 'gray.700',
              position: 'relative',
              borderRadius: 0,
            },
            '.day-backdrop': {
              background: 'blue.75',
            },
          },
          '.react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-end': {
            bg: 'transparent',

            _hover: {
              bg: 'transparent'
            },

            '.day': {
              bg: 'blue.300',
              color: 'white',

              _hover: {
                bg: 'blue.400',
              },
            }
          },
          '.react-datepicker__day--outside-month day': {
            color: 'gray.400'
          },
          '.react-datepicker__day--keyboard-selected': {
            bg: 'transparent',

            '.day': {
              bg: 'gray.100',
            }
          },
          '.react-datepicker__day--keyboard-selected.react-datepicker__day--selected': {
            bg: 'transparent',

            '.day': {
              bg: 'blue.400',
            },
          },
          '.react-datepicker__day--keyboard-selected.react-datepicker__day--today': {
            bg: 'transparent',

            '.day': {
              bg: 'purple.400',
            },
          },
          '.react-datepicker__day--keyboard-selected.react-datepicker__day--in-selecting-range:not(.react-datepicker__day--selecting-range-end):not(.react-datepicker__day--selecting-range-start)': {
            bg: 'transparent',

            '.day': {
              bg: 'blue.75',
              color: 'gray.700',
            },
            '.day-backdrop': {
              background: 'blue.75',
            },
          },
          '.react-datepicker__day--in-range:not(.react-datepicker__day--in-selecting-range)': {
            bg: 'transparent',

            '.day': {
              color: 'gray.500',
              bg: 'transparent',
            },
            '.day-backdrop': {
              bg: 'transparent',
            }
          },
          '.react-datepicker__week': {
            '.react-datepicker__day--in-range:first-of-type, .react-datepicker__day--in-selecting-range:first-of-type': {
              '.day-backdrop': {
                left: 4,
              },
              '.day': {
                borderRadius: '50%',
              }
            },
            '.react-datepicker__day--in-range:last-of-type, .react-datepicker__day--in-selecting-range:last-of-type': {
              '.day-backdrop': {
                left: -4,
              },
              '.day': {
                borderRadius: '50%',
              }
            },
            '.react-datepicker__day--in-selecting-range:first-of-type.react-datepicker__day--selecting-range-end, .react-datepicker__day--in-selecting-range:last-of-type.react-datepicker__day--selecting-range-start': {
              '.day-backdrop': {
                bg: 'transparent'
              },
              '.day': {
                borderRadius: '50%',
              }
            },
          },

          '&.focused': {
            '.container-overlay': {
              zIndex: -1,
            }
          }
        },
        '.react-datepicker-popper': {
          zIndex: 'var(--chakra-zIndices-popover)',
        },
        'div[data-popper-placement="bottom-start"] div[data-popper-arrow="true"], div[data-popper-placement="top-start"] div[data-popper-arrow="true"]': {
          transform: 'translate3d(18px, 0px, 0px) !important',
        },
      },
    }),
  },
  colors: {
    blue: {
      25: '#F4FBFF',
      75: '#D6F1FF',
    },
    gray: {
      75: '#F4F8FB',
    },
    orange: {
      75: '#FFF5E0',
    },
    yellow: {
      75: '#FFFFD1',
    },
    green: {
      75: '#DBFFE5',
    },
    teal: {
      75: '#D6FFF7',
    },
    cyan: {
      75: '#DAFBFB',
    },
    purple: {
      75: '#F2E5FF',
    },
    pink: {
      75: '#FFEBEF',
    },
  },
  components: {
    ...InputWrapperStyles,
    Text: {
      baseStyle: {
        lineHeight: 6,
      },
    },
    Radio: {
      baseStyle: {
        label: {
          flex: 1,
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          borderWidth: '0',
          overflow: 'hidden',
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          transitionProperty: 'common',
          transitionDuration: 'normal',
        },
      },
      variants: {
        indeterminateUnfilled: {
          control: {
            transitionProperty: 'common',
            transitionDuration: 'normal',
            bg: 'white',
            _indeterminate: {
              bg: 'white',
              borderColor: 'gray.200',
              color: 'gray.200',
            },
          },
        },
      },
      sizes: {
        xl: {
          control: {
            w: 6,
            h: 6,
          },
          label: {
            fontSize: 'lg',
          },
          icon: {
            fontSize: '2xs',
          },
        },
      },
    },
    Drawer: {
      variants: {
        aside: {
          dialog: {
            pointerEvents: 'auto',
          },
          dialogContainer: {
            pointerEvents: 'none',
          },
        },
      },
    },
    Popover: {
      baseStyle: {
        popper: {
          zIndex: 'popover',
          _focus: { boxShadow: 'none', outline: 'none' },
          _focusVisible: { boxShadow: 'none', outline: 'none' },
        },
        content: {
          _focus: { boxShadow: 'none', outline: 'none' },
          _focusVisible: { boxShadow: 'none', outline: 'none' },
        },
      },
      variants: {
        relative: {
          popper: {
            position: 'relative!important',
          },
        },
      },
    },
    Tooltip: {
      baseStyle: {
        borderRadius: 'md',
        '.chakra-tooltip__arrow': {
          borderBottomLeftRadius: '2px',
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <RootStoreProvider router={router}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RootStoreProvider>
      </UserProvider>
    </ChakraProvider>
  );
}
