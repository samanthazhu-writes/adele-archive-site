阿黛勒网页按钮修订说明

已修改的 HTML：
- 所有 data-i18n="buttons.requestSampleKit" 的按钮：改为复制邮箱按钮。
- contact.html 顶部 Email Samantha Zhu：改为复制邮箱按钮。
- 非 footer 区域的 Contact the Author：改为复制邮箱按钮。
- Download One-page Pitch 保持 <a download> 不变。
- Back to Reading Path / Back to Home 保持跳转不变。
- footer 里的 Contact 保持跳转 contact.html 不变。

重要：
请把 js/main_js_append_copy_email.js 的内容复制到你项目的 js/main.js 最后，只需要复制一次。

可选：
如果想让“Email copied”状态更明显，可以把 css_copy_email_optional.css 的内容追加到 css/style.css 末尾。

修改统计：

noah-dreams.html: {'requestSampleKit': 0, 'emailSamanthaZhu': 0, 'contactAuthor': 2, 'edenContact': 0}
reliquarians.html: {'requestSampleKit': 1, 'emailSamanthaZhu': 0, 'contactAuthor': 1, 'edenContact': 0}
temple-guide.html: {'requestSampleKit': 0, 'emailSamanthaZhu': 0, 'contactAuthor': 2, 'edenContact': 0}
archive-notices.html: {'requestSampleKit': 0, 'emailSamanthaZhu': 0, 'contactAuthor': 1, 'edenContact': 0}
contact.html: {'requestSampleKit': 0, 'emailSamanthaZhu': 1, 'contactAuthor': 0, 'edenContact': 0}
eden.html: {'requestSampleKit': 0, 'emailSamanthaZhu': 0, 'contactAuthor': 0, 'edenContact': 1}
first-gospel.html: {'requestSampleKit': 1, 'emailSamanthaZhu': 0, 'contactAuthor': 1, 'edenContact': 0}
index.html: {'requestSampleKit': 0, 'emailSamanthaZhu': 0, 'contactAuthor': 0, 'edenContact': 0}
main-project.html: {'requestSampleKit': 2, 'emailSamanthaZhu': 0, 'contactAuthor': 0, 'edenContact': 0}
night-of-silence.html: {'requestSampleKit': 1, 'emailSamanthaZhu': 0, 'contactAuthor': 1, 'edenContact': 0}