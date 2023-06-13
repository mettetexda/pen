var ExtensionIcon = {
    icons: undefined,
    getExtensionIconString: undefined
};

/**
 * Map Of Font Icons
 */
 ExtensionIcon.icons = {};

/**
 * Return string of font icon, which can be set as text of any div
 * with font-family set as '<%= fontName %>'
 * @param iconName
 * @returns {string}
 */
 ExtensionIcon.getExtensionIconString = function(iconName){
    return String.fromCharCode(this.icons[iconName]);
};
<% _.each(glyphs, function(glyph) { %>
ExtensionIcon.icons["<%= cssClass %>-<%= glyph.fileName %>"] = 0x<%= glyph.codePoint %>;
<% }); %>