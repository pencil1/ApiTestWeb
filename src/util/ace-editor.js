// 这里需要提前引入
let ace = require('brace');
require('brace/theme/chrome');
require('brace/ext/language_tools');
// 格式化
require('brace/snippets/json');
require('brace/snippets/html');
require('brace/snippets/javascript');
require('brace/snippets/xml');
// 引入格式文件
require('brace/mode/html');
require('brace/mode/json');
require('brace/mode/javascript');
require('brace/mode/xml');

// language
module.exports  = {
    render(h) {
        const height = this.height ? this.px(this.height) : '100%';
        const width = this.width ? this.px(this.width) : '100%';
        return h('div', {
            attrs: {
                style: `height: ${height}; width: ${width}`,
            },
            ref: 'editor',
        });
    },

    props: {
        value: {
            type: String,
            default: '',
        },
        lang: true,
        theme: String,
        height: true,
        width: true,
        options: Object,
        readOnly: false,
    },

    data() {
        return {
            editor: null,
            contentBackup: '',
        };
    },
    watch: {
        readOnly: {
            immediate: false,
            handler(v) {
                this.editor.setReadOnly(v);
            },
        },
        value(val) {
            if (this.contentBackup !== val) {
                this.editor.setValue(val, 1);
                this.contentBackup = val;
            }
        },
        theme(newTheme) {
            this.editor.setTheme(`ace/theme/${newTheme}`);
        },
        lang(newLang) {
            this.editor
                .getSession()
                .setMode(typeof newLang === 'string' ? `ace/mode/${newLang}` : newLang);
        },
        options(newOption) {
            this.editor.setOptions(newOption);
        },
        height() {
            this.$nextTick(() => {
                this.editor.resize();
            });
        },
        width() {
            this.$nextTick(() => {
                this.editor.resize();
            });
        },

    },
    beforeDestroy() {
        this.editor.destroy();
        this.editor.container.remove();
    },
    mounted() {
        if (!ace) {
            ace = window.ace;
        }
        const vm = this;

        vm.editor = ace.edit(this.$el);

        const {editor} = vm;
        editor.$blockScrolling = Infinity;
        this.$emit('init', editor);
        this.setLang();
        this.setTheme();

        this.contentBackup = this.value;

        editor.on('change', () => {
            const content = editor.getValue();
            vm.$emit('input', content);
            vm.contentBackup = content;
        });
        // 监听事件
        if (this.$refs.editor) {
            const observe = new ResizeObserver((_el) => {
                const {target} = _el[0];
                if (target && target.offsetWidth) {
                    this.editor.resize();
                }
            });
            observe.observe(this.$refs.editor);
        }

        if (vm.options) editor.setOptions(vm.options);

        this.$emit('input', vm.value);
        if (vm.value) editor.setValue(vm.value, 1);
        vm.editor.setReadOnly(vm.readOnly);
    },
    methods: {
        px(n) {
            if (/^\d*$/.test(n)) {
                return `${n}px`;
            }
            return n;
        },
        setLang() {
            const {editor} = this;
            const lang = this.lang || 'text';
            editor.getSession().setMode(typeof lang === 'string' ? `ace/mode/${lang}` : lang);
        },
        setTheme() {
            const theme = this.theme || 'chrome';
            this.editor.setTheme(`ace/theme/${theme}`);
        },
    },
};
