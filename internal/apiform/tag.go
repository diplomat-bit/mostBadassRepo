// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/internal/apiform/tag.go
================================================================================

package apiform

import (
	"reflect"
	"strings"
)

const jsonStructTag = "json"
const formStructTag = "form"
const formatStructTag = "format"

type parsedStructTag struct {
	name     string
	required bool
	extras   bool
	metadata bool
}

func parseFormStructTag(field reflect.StructField) (tag parsedStructTag, ok bool) {
	raw, ok := field.Tag.Lookup(formStructTag)
	if !ok {
		raw, ok = field.Tag.Lookup(jsonStructTag)
	}
	if !ok {
		return
	}
	parts := strings.Split(raw, ",")
	if len(parts) == 0 {
		return tag, false
	}
	tag.name = parts[0]
	for _, part := range parts[1:] {
		switch part {
		case "required":
			tag.required = true
		case "extras":
			tag.extras = true
		case "metadata":
			tag.metadata = true
		}
	}
	return
}

func parseFormatStructTag(field reflect.StructField) (format string, ok bool) {
	format, ok = field.Tag.Lookup(formatStructTag)
	return
}
