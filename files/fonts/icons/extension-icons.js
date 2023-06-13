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
 * with font-family set as 'extension-icons'
 * @param iconName
 * @returns {string}
 */
 ExtensionIcon.getExtensionIconString = function(iconName){
    return String.fromCharCode(this.icons[iconName]);
};

ExtensionIcon.icons["extension_icon-add_assessment"] = 0xEA01;

ExtensionIcon.icons["extension_icon-add_media"] = 0xEA02;

ExtensionIcon.icons["extension_icon-annotation_toolbar"] = 0xEA03;

ExtensionIcon.icons["extension_icon-assessment_auto_detect"] = 0xEA04;

ExtensionIcon.icons["extension_icon-assessment_cloze"] = 0xEA05;

ExtensionIcon.icons["extension_icon-assessment_draw"] = 0xEA06;

ExtensionIcon.icons["extension_icon-assessment_hotspot"] = 0xEA07;

ExtensionIcon.icons["extension_icon-assessment_matching"] = 0xEA08;

ExtensionIcon.icons["extension_icon-assessment_multiplechoice"] = 0xEA09;

ExtensionIcon.icons["extension_icon-assessment_multipleresponse"] = 0xEA0A;

ExtensionIcon.icons["extension_icon-assessment_shortanswer"] = 0xEA0B;

ExtensionIcon.icons["extension_icon-assessment_truefalse"] = 0xEA0C;

ExtensionIcon.icons["extension_icon-assessment_yesno"] = 0xEA0D;

ExtensionIcon.icons["extension_icon-audio_wave"] = 0xEA0E;

ExtensionIcon.icons["extension_icon-back"] = 0xEA0F;

ExtensionIcon.icons["extension_icon-base_annotations_invisible"] = 0xEA10;

ExtensionIcon.icons["extension_icon-base_annotations_visible"] = 0xEA11;

ExtensionIcon.icons["extension_icon-bold"] = 0xEA12;

ExtensionIcon.icons["extension_icon-capture_new_page"] = 0xEA13;

ExtensionIcon.icons["extension_icon-capture_tab"] = 0xEA14;

ExtensionIcon.icons["extension_icon-chevron_down"] = 0xEA15;

ExtensionIcon.icons["extension_icon-chevron_left"] = 0xEA16;

ExtensionIcon.icons["extension_icon-chevron_right"] = 0xEA17;

ExtensionIcon.icons["extension_icon-chevron_up"] = 0xEA18;

ExtensionIcon.icons["extension_icon-clock"] = 0xEA19;

ExtensionIcon.icons["extension_icon-close"] = 0xEA1A;

ExtensionIcon.icons["extension_icon-close_button_msg_dialog"] = 0xEA1B;

ExtensionIcon.icons["extension_icon-comments"] = 0xEA1C;

ExtensionIcon.icons["extension_icon-copy_clipboard"] = 0xEA1D;

ExtensionIcon.icons["extension_icon-copy_link"] = 0xEA1E;

ExtensionIcon.icons["extension_icon-delete"] = 0xEA1F;

ExtensionIcon.icons["extension_icon-download"] = 0xEA20;

ExtensionIcon.icons["extension_icon-duplicate"] = 0xEA21;

ExtensionIcon.icons["extension_icon-edit"] = 0xEA22;

ExtensionIcon.icons["extension_icon-ellipse"] = 0xEA23;

ExtensionIcon.icons["extension_icon-eraser"] = 0xEA24;

ExtensionIcon.icons["extension_icon-export"] = 0xEA25;

ExtensionIcon.icons["extension_icon-gcal"] = 0xEA26;

ExtensionIcon.icons["extension_icon-hide_annotations"] = 0xEA27;

ExtensionIcon.icons["extension_icon-hide_comments"] = 0xEA28;

ExtensionIcon.icons["extension_icon-highlighter"] = 0xEA29;

ExtensionIcon.icons["extension_icon-import_pdf"] = 0xEA2A;

ExtensionIcon.icons["extension_icon-info"] = 0xEA2B;

ExtensionIcon.icons["extension_icon-italics"] = 0xEA2C;

ExtensionIcon.icons["extension_icon-laser"] = 0xEA2D;

ExtensionIcon.icons["extension_icon-line"] = 0xEA2E;

ExtensionIcon.icons["extension_icon-line_dashed"] = 0xEA2F;

ExtensionIcon.icons["extension_icon-line_dotted"] = 0xEA30;

ExtensionIcon.icons["extension_icon-line_double_arrow"] = 0xEA31;

ExtensionIcon.icons["extension_icon-line_end_arrow"] = 0xEA32;

ExtensionIcon.icons["extension_icon-line_wave"] = 0xEA33;

ExtensionIcon.icons["extension_icon-line_wave_large"] = 0xEA34;

ExtensionIcon.icons["extension_icon-line_wave_medium"] = 0xEA35;

ExtensionIcon.icons["extension_icon-logout"] = 0xEA36;

ExtensionIcon.icons["extension_icon-math_text"] = 0xEA37;

ExtensionIcon.icons["extension_icon-mcq_single_column"] = 0xEA38;

ExtensionIcon.icons["extension_icon-mcq_single_row"] = 0xEA39;

ExtensionIcon.icons["extension_icon-mcq_three_columns"] = 0xEA3A;

ExtensionIcon.icons["extension_icon-mcq_three_columns_b"] = 0xEA3B;

ExtensionIcon.icons["extension_icon-mcq_two_columns"] = 0xEA3C;

ExtensionIcon.icons["extension_icon-mcq_two_rows"] = 0xEA3D;

ExtensionIcon.icons["extension_icon-mic"] = 0xEA3E;

ExtensionIcon.icons["extension_icon-minimize"] = 0xEA3F;

ExtensionIcon.icons["extension_icon-more_options"] = 0xEA40;

ExtensionIcon.icons["extension_icon-mouse"] = 0xEA41;

ExtensionIcon.icons["extension_icon-move"] = 0xEA42;

ExtensionIcon.icons["extension_icon-mrq_single_column"] = 0xEA43;

ExtensionIcon.icons["extension_icon-mrq_single_row"] = 0xEA44;

ExtensionIcon.icons["extension_icon-mrq_three_columns"] = 0xEA45;

ExtensionIcon.icons["extension_icon-mrq_three_columns_b"] = 0xEA46;

ExtensionIcon.icons["extension_icon-mrq_two_columns"] = 0xEA47;

ExtensionIcon.icons["extension_icon-mrq_two_rows"] = 0xEA48;

ExtensionIcon.icons["extension_icon-mute"] = 0xEA49;

ExtensionIcon.icons["extension_icon-new_keyboard"] = 0xEA4A;

ExtensionIcon.icons["extension_icon-next"] = 0xEA4B;

ExtensionIcon.icons["extension_icon-notebook"] = 0xEA4C;

ExtensionIcon.icons["extension_icon-page"] = 0xEA4D;

ExtensionIcon.icons["extension_icon-pause"] = 0xEA4E;

ExtensionIcon.icons["extension_icon-pause_button"] = 0xEA4F;

ExtensionIcon.icons["extension_icon-pen"] = 0xEA50;

ExtensionIcon.icons["extension_icon-play"] = 0xEA51;

ExtensionIcon.icons["extension_icon-play_button"] = 0xEA52;

ExtensionIcon.icons["extension_icon-plus"] = 0xEA53;

ExtensionIcon.icons["extension_icon-recording_pause"] = 0xEA54;

ExtensionIcon.icons["extension_icon-recording_start"] = 0xEA55;

ExtensionIcon.icons["extension_icon-recording_stop"] = 0xEA56;

ExtensionIcon.icons["extension_icon-rectangle"] = 0xEA57;

ExtensionIcon.icons["extension_icon-rect_background"] = 0xEA58;

ExtensionIcon.icons["extension_icon-redo"] = 0xEA59;

ExtensionIcon.icons["extension_icon-reset"] = 0xEA5A;

ExtensionIcon.icons["extension_icon-reset_timer"] = 0xEA5B;

ExtensionIcon.icons["extension_icon-save_annotations"] = 0xEA5C;

ExtensionIcon.icons["extension_icon-screen_shade"] = 0xEA5D;

ExtensionIcon.icons["extension_icon-selected_div_check"] = 0xEA5E;

ExtensionIcon.icons["extension_icon-settings"] = 0xEA5F;

ExtensionIcon.icons["extension_icon-shareable_link"] = 0xEA60;

ExtensionIcon.icons["extension_icon-show_annotations"] = 0xEA61;

ExtensionIcon.icons["extension_icon-show_toolbar"] = 0xEA62;

ExtensionIcon.icons["extension_icon-start_presentation"] = 0xEA63;

ExtensionIcon.icons["extension_icon-start_presentation_c"] = 0xEA64;

ExtensionIcon.icons["extension_icon-start_presentation_d"] = 0xEA65;

ExtensionIcon.icons["extension_icon-start_presentation_e"] = 0xEA66;

ExtensionIcon.icons["extension_icon-start_presentation_f"] = 0xEA67;

ExtensionIcon.icons["extension_icon-start_presentation_g"] = 0xEA68;

ExtensionIcon.icons["extension_icon-start_presentation_h"] = 0xEA69;

ExtensionIcon.icons["extension_icon-start_presentation_i"] = 0xEA6A;

ExtensionIcon.icons["extension_icon-start_presentation_j"] = 0xEA6B;

ExtensionIcon.icons["extension_icon-start_presentation_k"] = 0xEA6C;

ExtensionIcon.icons["extension_icon-start_presentation_m"] = 0xEA6D;

ExtensionIcon.icons["extension_icon-stop_presentation"] = 0xEA6E;

ExtensionIcon.icons["extension_icon-student_notes"] = 0xEA6F;

ExtensionIcon.icons["extension_icon-student_notes_feedback_invisible"] = 0xEA70;

ExtensionIcon.icons["extension_icon-student_notes_feedback_visible"] = 0xEA71;

ExtensionIcon.icons["extension_icon-student_notes_invisible"] = 0xEA72;

ExtensionIcon.icons["extension_icon-student_notes_locked"] = 0xEA73;

ExtensionIcon.icons["extension_icon-student_notes_locked_base"] = 0xEA74;

ExtensionIcon.icons["extension_icon-student_notes_locked_layer"] = 0xEA75;

ExtensionIcon.icons["extension_icon-student_notes_unlocked"] = 0xEA76;

ExtensionIcon.icons["extension_icon-student_notes_unlocked_base"] = 0xEA77;

ExtensionIcon.icons["extension_icon-student_notes_unlocked_layer"] = 0xEA78;

ExtensionIcon.icons["extension_icon-student_notes_visible"] = 0xEA79;

ExtensionIcon.icons["extension_icon-stylus_pen"] = 0xEA7A;

ExtensionIcon.icons["extension_icon-text"] = 0xEA7B;

ExtensionIcon.icons["extension_icon-text_color"] = 0xEA7C;

ExtensionIcon.icons["extension_icon-text_fill_color"] = 0xEA7D;

ExtensionIcon.icons["extension_icon-text_highlighter"] = 0xEA7E;

ExtensionIcon.icons["extension_icon-underline"] = 0xEA7F;

ExtensionIcon.icons["extension_icon-undo"] = 0xEA80;

ExtensionIcon.icons["extension_icon-webcam_off"] = 0xEA81;

ExtensionIcon.icons["extension_icon-webcam_on"] = 0xEA82;

ExtensionIcon.icons["extension_icon-web_annotation"] = 0xEA83;

ExtensionIcon.icons["extension_icon-youtube_play_button"] = 0xEA84;