import { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { RootStoreProvider } from '../stores/RootStore';
import Layout from '../components/Layout';
import { InputWrapperStyles } from '../components/shared/InputWrapper';
//import 'tact-block-note-core/src/globals.css';

import { configure } from 'react-hotkeys';

configure({
  ignoreTags: [],
  ignoreEventsCondition: () => false
});

const theme = extendTheme({
  styles: {
    global: props => ({
      body: {
        '.clear': {
          clear: 'both',
        },
        '.ProseMirror': {
          // @see https://github.com/jesster2k10/guava-cards/blob/5d5c283eb720bf503258f4e17bce3865d35fd8d3/packages/website/src/bundles/editor/ContentEditor.tsx#L86
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
            fontSize: '1.25rem',
          },
          h2: {
            fontSize: '1.15rem',
          },
          h3: {
            fontSize: '1rem',
          },
          'h1, h2, h3, h4,  h5, h6 ': {
            fontWeight: '700',
          },
          'ul, ol': {
            padding: '0 1.2rem',
          },
          code: {
            bg: 'rgba(#616161, 0.1)',
            color: '#616161',
          },
          pre: {
            fontFamily: 'JetBrainsMono, \'Courier New\', Courier, monospace',
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

            '.hljs-number,  .hljs-meta, .hljs-built_in, .hljs-builtin-name, .hljs-literal,  .hljs-type, .hljs-params': {
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
        }, // .ProseMirror
      },
    }),
  },
  components: {
    ...InputWrapperStyles,
    Menu: {
      baseStyle: {
        list: {
          borderWidth: '0',
          overflow: 'hidden',
        }
      }
    },
    Checkbox: {
      baseStyle: {
        control: {
          transitionProperty: 'common',
          transitionDuration: 'normal',
          bg: 'white',
          _indeterminate: {
            bg: 'white',
            borderColor: 'gray.200',
            color: 'gray.200',
          },
        }
      },
      sizes: {
        xl: {
          control: {
            w: 6,
            h: 6,
          },
          label: {
            fontSize: 'lg'
          },
          icon: {
            fontSize: '2xs'
          },
        }
      }
    },
    Drawer: {
      variants: {
        aside: {
          dialog: {
            pointerEvents: 'auto'
          },
          dialogContainer: {
            pointerEvents: 'none'
          }
        }
      }
    },
    Popover: {
      variants: {
        relative: {
          popper: {
            position: 'relative!important'
          }
        }
      }
    }
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <RootStoreProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RootStoreProvider>
    </ChakraProvider>
  );
}
