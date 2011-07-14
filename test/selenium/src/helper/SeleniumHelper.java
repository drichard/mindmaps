package helper;

public class SeleniumHelper {

	public static class Node {
		private static final String NEXT_NODE = " > .node-container";
		private static final String SELECTED = ".selected";
		private static final String TEXT = " > .node-caption";
		private static final String ROOT = ".node-container.root";
		private static final String BUTTON_FOLD = " > .button-fold";
		private static final String ID = "@id";

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

		public Node foldButton() {
			path.append(BUTTON_FOLD);
			return this;
		}
	}

	public static Node Root() {
		return new Node().root();
	}
}
