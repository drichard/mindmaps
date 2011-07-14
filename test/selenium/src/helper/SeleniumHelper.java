package helper;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SeleniumHelper {

	public static class Node {
		private static final String NEXT_NODE = " > .node-container";
		private static final String SELECTED = ".selected";
		private static final String TEXT = " > .node-caption";
		private static final String ROOT = ".node-container.root";
		private static final String BUTTON_FOLD = " > .button-fold";
		private static final String ID = "@id";
		private static final String STYLE = "@style";

		private StringBuilder path = new StringBuilder();

		public String get() {
			return path.toString();
		}

		public Node() {
			path.append("css=");
		}

		public Node(String id) {
			path.append("css=#" + id);
		}

		public Node next() {
			path.append(NEXT_NODE);
			return this;
		}

		public Node selected() {
			path.append(SELECTED);
			return this;
		}

		public Node text() {
			path.append(TEXT);
			return this;
		}

		public Node root() {
			path.append(ROOT);
			return this;
		}

		public String id() {
			path.append(ID);
			return get();
		}

		public String style() {
			path.append(STYLE);
			return get();
		}

		public Node foldButton() {
			path.append(BUTTON_FOLD);
			return this;
		}
	}

	public static Node Root() {
		return new Node().root();
	}

	private static final Pattern fontSizePattern = Pattern.compile("font-size: (\\d{1,3})px");
	public static Integer getFontSize(String style) {
		Matcher matcher = fontSizePattern.matcher(style);
		if (matcher.find()) {
			String group = matcher.group(1);
			Integer number = Integer.valueOf(group);
			return number;
		}
		return null;
	}
	
	private static final Pattern fontWeightPattern = Pattern.compile("font-weight: (.*?);");
	public static String getFontWeight(String style) {
		Matcher matcher = fontWeightPattern.matcher(style);
		if (matcher.find()) {
			String group = matcher.group(1);
			return group;
		}
		return null;
	}
	
	private static final Pattern fontStylePattern = Pattern.compile("font-style: (.*?);");
	public static String getFontStyle(String style) {
		Matcher matcher = fontStylePattern.matcher(style);
		if (matcher.find()) {
			String group = matcher.group(1);
			return group;
		}
		return null;
	}
	
	private static final Pattern textDecorationPattern = Pattern.compile("text-decoration: (.*?);");
	public static String getTextDecoration(String style) {
		Matcher matcher = textDecorationPattern.matcher(style);
		if (matcher.find()) {
			String group = matcher.group(1);
			return group;
		}
		return null;
	}
	
	private static final Pattern textColorPattern = Pattern.compile("color: (.*?);");
	public static String getTextColor(String style) {
		Matcher matcher = textColorPattern.matcher(style);
		if (matcher.find()) {
			String group = matcher.group(1);
			return group;
		}
		return null;
	}
	
}
